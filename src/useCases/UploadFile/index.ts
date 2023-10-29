import { UploadFileController } from './UploadFileController';
import { UploadFileUseCase } from './UploadFileUseCase';
import { BlackBlazeBucketUpload } from '../../providers/implementations/BlackBlazeBucketUpload';
import { PostgresUploadRepository } from '../../repositories/implementations/PostgresUploadRepository'


const blackBlazeBucketUpload = new BlackBlazeBucketUpload();
const postgresUploadRepository = new PostgresUploadRepository();

const uploadFileUseCase = new UploadFileUseCase(
    postgresUploadRepository,
    blackBlazeBucketUpload
);

const uploadFileController = new UploadFileController(
    uploadFileUseCase
);


export { uploadFileController };