import { File } from '../../entities/File'

import {
    IABucketFileProvider, IListFilesResponseDTO, IUploadFileResponseDTO,
    IfileUpload
} from "../IABucketFileProvider"

import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    HeadObjectCommand,
    S3Client, UploadPartCommand,
} from '@aws-sdk/client-s3'

const s3 = new S3Client({
    endpoint: process.env.ENDPOINT_S3!,
    region: process.env.REGION!,
    credentials: {
        accessKeyId: process.env.KEY_ID!,
        secretAccessKey: process.env.APP_KEY!,
    }
})

export class BlackBlazeBucketFile implements IABucketFileProvider {
    deleteFile(file: File): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async listFiles(files: File[]): Promise<IListFilesResponseDTO[]> {
        const existsFiles: IListFilesResponseDTO[] = [];
        try {
            for (const file of files) {
                const headObjectCommand = new HeadObjectCommand({
                    Bucket: process.env.BACKBLAZE_BUCKET,
                    Key: `${process.env.UPLOAD_FOLDER}/${file.name}`,
                });
                try {
                    const data = await s3.send(headObjectCommand);
                    existsFiles.push({
                        name: file.name,
                        size: data.ContentLength || 0,
                        mimetype: data.ContentType || '',
                        location: `https://${process.env.BACKBLAZE_BUCKET}.s3.
                        ${process.env.REGION}.backblazeb2.com/${process.env.UPLOAD_FOLDER}/${file.name}`,
                    })

                } catch (NotFound) {
                    continue;
                }
            }
            return existsFiles;
        } catch (error) {
            console.error(error)
            throw new Error(error as string)
        }
    }
    async uploadFile(data: IfileUpload): Promise<IUploadFileResponseDTO> {

        let uploadId;
        try {
            const multipartUpload = await s3.send(
                new CreateMultipartUploadCommand({
                    Bucket: process.env.BACKBLAZE_BUCKET,
                    Key: `${process.env.UPLOAD_FOLDER}/${data.originalname}`,
                })
            );
            uploadId = multipartUpload.UploadId;
            const uploadPromises = [];

            let numPartsLeft = 5;
            let partSize = Math.ceil(data.buffer.length / numPartsLeft);

            if (!(partSize > 1024 * 1024 * 5)) {
                numPartsLeft = 1;
                partSize = Math.ceil(data.buffer.length / numPartsLeft);
            }

            for (let i = 0; i < numPartsLeft; i++) {
                const star = partSize * i;
                const end = Math.min(star + partSize, data.buffer.length);
                uploadPromises.push(
                    s3.send(
                        new UploadPartCommand({
                            Bucket: process.env.BACKBLAZE_BUCKET,
                            Key: `${process.env.UPLOAD_FOLDER}/${data.originalname}`,
                            PartNumber: i + 1,
                            UploadId: uploadId,
                            Body: data.buffer.subarray(star, end),
                        }),
                    )
                        .then((data) => {
                            console.info("Part", i + 1, "uploaded");
                            return data;
                        })
                );
            }
            const results = await Promise.all(uploadPromises);

            const file = await s3.send(
                new CompleteMultipartUploadCommand({
                    Bucket: process.env.BACKBLAZE_BUCKET,
                    Key: `${process.env.UPLOAD_FOLDER}/${data.originalname}`,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: results.map((part, index) => ({
                            ETag: part.ETag,
                            PartNumber: index + 1,
                        })),
                    },
                })
            );
            console.info("Upload completed successfully.");
            return {
                url: `https://${process.env.BACKBLAZE_BUCKET}.s3.${process.env.REGION}.backblazeb2.com/${process.env.UPLOAD_FOLDER}/${data.originalname}`,
                path: file.Key
            } as IUploadFileResponseDTO

        }
        catch (error: any) {
            console.error(error)
            if (uploadId) {
                const abortCommand = new AbortMultipartUploadCommand({
                    Bucket: process.env.BACKBLAZE_BUCKET,
                    Key: `${process.env.UPLOAD_FOLDER}/${data.originalname}`,
                    UploadId: uploadId,
                });
                await s3.send(abortCommand);
            }
            throw new Error(error)
        }
    }




}