import { IAFilesRepository } from "../IAFilesRepository";
import { FileCreate, File } from "../../entities/File";

import { PrismaClient } from "@prisma/client";
import { AppError } from "../../erros/AppError";

const prisma = new PrismaClient();


export class PostgresFileRepository implements IAFilesRepository {
    updateExpirationDate({ fileId, authorId, newExperationDate }: { fileId: string, authorId: string, newExperationDate: Date }): Promise<File> {
        try {
            const file = prisma.file.update({
                where: {
                    id: fileId,
                    authorId: authorId,
                },
                data: {
                    expirationDate: newExperationDate,
                },
            });
            return file;
        } catch (error: any) {
            console.log(error)
            throw new AppError(error.message, error.statusCode);
        }
    }
    findById({ fileId, authorID }: { fileId: string, authorID: string }): Promise<File | null> {
        try {
            const file = prisma.file.findUnique({
                where: {
                    id: fileId,
                    authorId: authorID,
                },
            });
            return file;
        } catch (error: any) {
            console.log(error)
            throw new AppError(error.message, error.statusCode);
        }
    }
    async list(authorId: string): Promise<File[]> {
        try {
            const files = await prisma.file.findMany({
                where: {
                    authorId: authorId,
                    expired: false,
                },
            });
            return files;
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }
    }
    async save(file: FileCreate): Promise<void> {
        try {
            await prisma.file.create({
                data: {
                    name: file.name,
                    url: file.url,
                    expirationDate: file.expirationDate,
                    authorId: file.authorId,
                },
            });
        } catch (error: any) {
            throw new AppError(error.message, error.statusCode);
        }
    }
}