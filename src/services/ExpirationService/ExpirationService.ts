import { PrismaClient } from "@prisma/client";
import { DeleteObjectsCommand, ObjectIdentifier, S3Client } from "@aws-sdk/client-s3";
import { filterFileIsAfterNow } from "../../ultis/filterFileIsAfterNow";

export class ExpirationService {

    private prisma: PrismaClient;
    private s3: S3Client;

    constructor() {
        this.prisma = new PrismaClient();
        this.s3 = new S3Client({
            endpoint: process.env.ENDPOINT_S3!,
            region: process.env.REGION!,
            credentials: {
                accessKeyId: process.env.KEY_ID!,
                secretAccessKey: process.env.APP_KEY!,
            }
        });
    }
    async getExpiredFiles() {
        const files = await this.prisma.file.findMany({
            where: {
                expired: false,
            }
        });

        const filesExpired = filterFileIsAfterNow(files);

        if (filesExpired.length > 0) {
            await this.deleteExpiredFiles(filesExpired)
        }
        else { console.info('Not files expired'); }
    }
    async deleteExpiredFiles(filesExpired: object[]) {
        const objects: ObjectIdentifier[] = [];
        filesExpired.forEach(
            async (file: any) => {
                objects.push({ Key: `${process.env.UPLOAD_FOLDER}/${file.name}` });
                await this.prisma.file.update({
                    where: {
                        id: file.id,
                    },
                    data: {
                        expired: true,
                    }
                });
            }
        )
        const deleteObjectsCommand = new DeleteObjectsCommand({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Delete: {
                Objects: objects,
            },
        });
        this.s3.send(deleteObjectsCommand).
            then((data) => {
                console.info('Files deleted: ', data.Deleted?.length);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public static getExpirationDate(): Date {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + Number(process.env.EXPERATION_TIME));
        //expirationDate.setHours(expirationDate.getHours() + 1);
        return expirationDate;
    }
}