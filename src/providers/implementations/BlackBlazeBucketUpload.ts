import {
    IAUploadProvider, IUploadFileResponseDTO,
    IfileUpload
} from "../IABucketUploadProvider"

import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
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

export class BlackBlazeBucketUpload implements IAUploadProvider {
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
            // Divide o arquivo em 5 partes
            const partSize = Math.ceil(data.buffer.length / 5);
            for (let i = 0; i < 5; i++) {
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
                url: `${process.env.ENDPOINT_S3}/${data.originalname}`,
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

    async deleteFile(file: File): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async listFiles(): Promise<IUploadFileResponseDTO[]> {
        throw new Error("Method not implemented.");
    }
}