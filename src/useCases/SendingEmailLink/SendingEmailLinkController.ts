import { Request, Response } from 'express';
import { AppError } from '../../erros/AppError';
import { ValidationError } from 'yup';

import { SendingEmailLinkSchema } from './SendingEmailLinkSchema'
import { SendingEmailLinkUseCase } from './SendingEmailLinkUseCase';


export class SendingEmailLinkController {
    constructor(
        private sendingEmailLinkUseCase: SendingEmailLinkUseCase,
    ) { }

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const emailBody = await SendingEmailLinkSchema.validate(request.body, { abortEarly: false });
            const { email, idFile, experiedTime } = emailBody;
            const { id } = request.user;

            await this.sendingEmailLinkUseCase.execute({
                authorId: id,
                from: request.user.email,
                email: email,
                idFile: idFile,
                experiedTime: experiedTime || '',
            });

            return response.status(201).json({ message: 'Email enviado com sucesso' });
        } catch (error) {
            if (error instanceof ValidationError) {
                return response.status(400).json({
                    error: error.inner.map((err) => {
                        return { message: err.message, path: err.path }
                    })
                })
            }
            if (error instanceof AppError) {
                return response.status(409).json({
                    message: error.message,
                    statusCode: error.statusCode,
                })
            }
            return response.status(500).json({ error: 'Internal Server Error' })
        }
    }
};
