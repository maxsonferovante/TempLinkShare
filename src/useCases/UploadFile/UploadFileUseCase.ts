import { AppError } from "../../erros/AppError";
import { PostgresFileRepository } from "../../repositories/implementations/PostgresFileRepository";
import { IUploadFileRequestDTO } from "./IUploadFileRequestDTO";

import { BlackBlazeBucketFile } from "../../providers/implementations/BlackBlazeBucketFile"
import { normalizeName } from "../../utils/normalizeName";

import { ExpirationService } from "../../services/ExpirationService/ExpirationService"
import moment from "moment";

export class UploadFileUseCase {
    constructor(
        private uploadRespository: PostgresFileRepository,
        private bucketUpload: BlackBlazeBucketFile,
    ) { }
    async execute(data: IUploadFileRequestDTO) {
        try {
            if (data.buffer.length > 1024 * 1024 * Number(process.env.LIMIT_SIZE)) {
                throw new AppError(`File size is too large. O limit max is ${process.env.LIMIT_SIZE}`, 400);
            }

            data.originalname = normalizeName(data.originalname);

            const responseUploaded = await this.bucketUpload.uploadFile({
                originalname: data.originalname,
                buffer: data.buffer,
                mimetype: data.mimetype,
            });
            const expirationDate = ExpirationService.getExpirationDate()
            await this.uploadRespository.save({
                name: data.originalname,
                expirationDate: expirationDate,
                url: responseUploaded.url,
                authorId: data.authorId,
            });
            return {
                responseUploaded,
                experationData: moment(expirationDate).format('DD/MM/YYYY HH:mm:ss'),
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode);
            }
            throw new AppError('Internal Server Error', 500);
        }
    }
}