import { Request, Response } from 'express';
import { createUserSchema } from './CreateUseSchema'
import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
    ) { }

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const user = await createUserSchema.validate(request.body);
            const { name, email, password } = user;

            const userCreated = await this.createUserUseCase.execute({
                name,
                email,
                password
            });
            return response.status(201).json(userCreated);
        } catch (err: any) {
            return response.status(err.statusCode).json({
                err
            });
        }
    }
}