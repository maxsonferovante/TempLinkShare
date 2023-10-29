export interface IUploadFileResponseDTO {
    url: string;
    path: string;
}

export interface IfileUpload {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}

export interface IAUploadProvider {
    uploadFile(file: IfileUpload): Promise<IUploadFileResponseDTO>;
    deleteFile(file: File): Promise<void>;
    listFiles(): Promise<IUploadFileResponseDTO[]>;
}