export interface IUploadFileResponseDTO {
    url: string;
    path: string;
}

export interface IfileUpload {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}
export interface IListFilesResponseDTO {
    name: string;
    size: number;
    mimetype: string;
    location: string;
}
export interface IABucketFileProvider {
    uploadFile(file: IfileUpload): Promise<IUploadFileResponseDTO>;
    deleteFile(file: File): Promise<void>;
    listFiles(file: File[]): Promise<IListFilesResponseDTO[]>;
}