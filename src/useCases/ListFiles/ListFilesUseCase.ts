import { AppError } from "../../erros/AppError";
import { IABucketFileProvider } from "../../providers/IABucketFileProvider";
import { PostgresFileRepository } from "../../repositories/implementations/PostgresFileRepository";
import { IUListFilesRequestDTO } from "./IListFilesRequestDTO";
import moment from "moment";

export class ListFilesUseCase {
    constructor(
        private fileRespository: PostgresFileRepository,
        private bucketFile: IABucketFileProvider
    ) { }
    async execute(data: IUListFilesRequestDTO) {
        try {
            const filesSavedByUser = await this.fileRespository.list(data.authorId);
            const filesBucket = await this.bucketFile.listFiles(filesSavedByUser);

            const filesSavedByUserInBucket = filesSavedByUser.map(
                (file) => {
                    const fileInBucket = filesBucket.find(
                        (fileInBucket) => fileInBucket.name === file.name
                    );
                    if (fileInBucket) {
                        return {
                            ...fileInBucket,
                            expirationDate: moment(file.expirationDate).format('DD/MM/YYYY HH:mm:ss'),
                            id: file.id,
                        };
                    }
                    return file;
                }
            );
            return filesSavedByUserInBucket;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode);
            }
            throw new AppError('Internal Server Error', 500);
        }
    }
}