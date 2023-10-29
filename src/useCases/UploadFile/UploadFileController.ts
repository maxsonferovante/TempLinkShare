import { Request, Response } from "express";
import { AppError } from '../../erros/AppError';

import { UploadFileUseCase } from "./UploadFileUseCase";

import { ValidationError } from "yup";


export class UploadFileController {
    constructor(
        private uploadFileUseCase: UploadFileUseCase
    ) { }
    async handle(request: Request, response: Response) {
        try {
            const { file } = request;
            const { id } = request.user;
            if (!file) {
                throw new AppError('File not found', 404);
            }
            const responseUpload = await this.uploadFileUseCase.execute({
                originalname: file.originalname,
                buffer: file.buffer,
                mimetype: file.mimetype,
                authorId: id,
            });
            return response.status(201).json(responseUpload);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    message: error.message,
                    statusCode: error.statusCode,
                })
            }
            if (error instanceof ValidationError) {
                return response.status(400).json({
                    path: error.path,
                    message: error.message
                })
            }
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' })
        }
    }
}