import { IAUploadRepository } from "../IAUploadRepository";
import { FileCreate, File } from "../../entities/File";

import { PrismaClient } from "@prisma/client";
import { AppError } from "../../erros/AppError";

const prisma = new PrismaClient();


export class PostgresUploadRepository implements IAUploadRepository {
    async save(file: FileCreate): Promise<void> {
        try {
            await prisma.file.create({
                data: {
                    name: file.name,
                    url: file.url,
                    expirationTime: file.experationTime,
                    authorId: file.authorId,
                },
            });
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }
    }
}