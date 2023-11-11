import { Request, Response } from "express";
import { AppError } from '../../erros/AppError';


import { ListFilesUseCase } from "./ListFilesUseCase";


export class ListFilesController {
    constructor(
        private listFileUseCase: ListFilesUseCase
    ) { }


    async handle(request: Request, response: Response) {
        try {
            const { id } = request.user

            const listFiles = await this.listFileUseCase.execute(
                { authorId: id }
            );

            return response.status(201).json(listFiles);

        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    message: error.message,
                    statusCode: error.statusCode,
                })
            }
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' })
        }
    };
}