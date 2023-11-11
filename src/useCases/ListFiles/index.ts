import { PostgresFileRepository } from '../../repositories/implementations/PostgresFileRepository'
import { BlackBlazeBucketFile } from '../../providers/implementations/BlackBlazeBucketFile';

import { ListFilesController } from './ListFilesController';
import { ListFilesUseCase } from './ListFilesUseCase';

const postgresUploadRepository = new PostgresFileRepository();

const blackBlazeBucketFile = new BlackBlazeBucketFile();

const listFilesUseCase = new ListFilesUseCase(
    postgresUploadRepository,
    blackBlazeBucketFile
);


const listFilesController = new ListFilesController(
    listFilesUseCase
);


export { listFilesController }