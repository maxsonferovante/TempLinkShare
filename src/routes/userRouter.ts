import { Router, Request, Response } from 'express';
import { createUserController } from '../useCases/CreateUser';
import { request } from 'http';

const userRouter = Router();


userRouter.post(
    '/register',
    (request: Request, response: Response) => {
        return createUserController.handle(request, response);
    }
);

export { userRouter };