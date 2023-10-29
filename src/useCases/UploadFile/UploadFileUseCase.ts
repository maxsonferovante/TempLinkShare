import { AppError } from "../../erros/AppError";
import { PostgresUploadRepository } from "../../repositories/implementations/PostgresUploadRepository";
import { IUploadFileRequestDTO } from "./IUploadFileRequestDTO";

import { IAUploadProvider } from "../../providers/IABucketUploadProvider"




export class UploadFileUseCase {
    constructor(
        private uploadRespository: PostgresUploadRepository,
        private bucketUpload: IAUploadProvider
    ) { }
    async execute(data: IUploadFileRequestDTO) {
        try {
            const responseUploaded = await this.bucketUpload.uploadFile({
                originalname: data.originalname,
                buffer: data.buffer,
                mimetype: data.mimetype,
            });
            const upload = await this.uploadRespository.save({
                name: data.originalname,
                experationTime: Number(process.env.EXPERATION_TIME) || 1,
                url: responseUploaded.url,
                authorId: data.authorId,
            });
            return {
                responseUploaded,
                experationTime: `${process.env.EXPERATION_TIME} hour(s)`,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode);
            }
            throw new AppError('Internal Server Error', 500);
        }
    }
}