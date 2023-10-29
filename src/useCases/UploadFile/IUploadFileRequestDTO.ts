export interface IUploadFileRequestDTO {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    authorId: string;
}