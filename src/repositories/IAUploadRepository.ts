import { FileCreate } from "../entities/File";


export interface IAUploadRepository {
    save(file: FileCreate): Promise<void>;
    // findById(id: string): Promise<File | null>;
    //findByName(name: string): Promise<File | null>;
    // delete(id: string): Promise<void>;
    // update(file: File): Promise<File>;
    // list(): Promise<File[]>;
}