import { FileCreate, File } from "../entities/File";


export interface IAFilesRepository {
    save(file: FileCreate): Promise<void>;
    findById({ fileId, authorID }: { fileId: string, authorID: string }): Promise<File | null>;
    //findByName(name: string): Promise<File | null>;
    // delete(id: string): Promise<void>;
    updateExpirationDate({ fileId, authorId, newExperationDate }: { fileId: string, authorId: string, newExperationDate: Date }): Promise<File>;
    list(authorId: string): Promise<File[]>;
}