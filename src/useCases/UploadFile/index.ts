import { UploadFileController } from './UploadFileController';
import { UploadFileUseCase } from './UploadFileUseCase';
import { BlackBlazeBucketFile } from '../../providers/implementations/BlackBlazeBucketFile';
import { PostgresFileRepository } from '../../repositories/implementations/PostgresFileRepository'


const blackBlazeBucketUpload = new BlackBlazeBucketFile();
const postgresUploadRepository = new PostgresFileRepository();

const uploadFileUseCase = new UploadFileUseCase(
    postgresUploadRepository,
    blackBlazeBucketUpload
);

const uploadFileController = new UploadFileController(
    uploadFileUseCase
);


export { uploadFileController };