import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { AuthenticateUserSchema } from './AuthenticateUserSchema'

import { Request, Response } from "express";
import { AppError } from '../../erros/AppError';
import { ValidationError } from 'yup';


export class AuthenticateUserController {
    constructor(
        private authenticateUserUseCase: AuthenticateUserUseCase,
    ) { }
    async handle(request: Request, response: Response) {
        try {
            const login = await AuthenticateUserSchema.validate(request.body,
                { abortEarly: false },
            );
            const { email, password } = login;

            const token = await this.authenticateUserUseCase.execute({ email, password });

            return response.status(200).json(token);

        } catch (error) {
            if (error instanceof ValidationError) {
                return response.status(400).json({
                    error: error.inner.map((err) => {
                        return { message: err.message, path: err.path }
                    })
                })
            }
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    message: error.message,
                    statusCode: error.statusCode,
                })
            }
            return response.status(500).json({ error: 'Internal Server Error' })
        }
    }
}