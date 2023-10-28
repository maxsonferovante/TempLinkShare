import { Request, Response } from 'express';
import { createUserSchema } from './CreateUseSchema'
import { CreateUserUseCase } from './CreateUserUseCase';
import { error } from 'console';
import { ValidationError } from 'yup';

export class CreateUserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
    ) { }

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const user = await createUserSchema.validate(request.body,
                { abortEarly: false },
            );
            const { name, email, password } = user;

            const userCreated = await this.createUserUseCase.execute({
                name,
                email,
                password
            });
            return response.status(201).json(userCreated);
        } catch (error) {
            if (error instanceof ValidationError) {
                return response.status(400).json({
                    error: error.inner.map((err) => {
                        return { message: err.message, path: err.path }
                    })
                })
            }
            if (error instanceof Error) {
                return response.status(409).json({ error: error.message })
            }
        }
        finally {
            return response.status(500).json({
                status: "error",
                message: "Internal Server Error"
            })
        }
    }
}