import { UploadFileController } from './UploadFileController';
import { UploadFileUseCase } from './UploadFileUseCase';
import { BlackBlazeBucketFile } from '../../providers/implementations/BlackBlazeBucketFile';
import { PostgresFileRepository } from '../../repositories/implementations/PostgresFileRepository'


const blackBlazeBucketFile = new BlackBlazeBucketFile();
const postgresUploadRepository = new PostgresFileRepository();

const uploadFileUseCase = new UploadFileUseCase(
    postgresUploadRepository,
    blackBlazeBucketFile
);

const uploadFileController = new UploadFileController(
    uploadFileUseCase
);


export { uploadFileController };