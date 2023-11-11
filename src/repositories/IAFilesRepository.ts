import { FileCreate } from "../entities/File";


export interface IAFilesRepository {
    save(file: FileCreate): Promise<void>;
    // findById(id: string): Promise<File | null>;
    //findByName(name: string): Promise<File | null>;
    // delete(id: string): Promise<void>;
    // update(file: File): Promise<File>;
    list(authorId: string): Promise<File[]>;
}