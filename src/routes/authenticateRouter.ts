import { Router, Request, Response } from "express";

import { authenticateUserController } from "../useCases/AuthenticateUser";


const authenticateRouter = Router();


authenticateRouter.post(
    "/login",
    (request: Request, response: Response) => {
        return authenticateUserController.handle(request, response);
    }
);


export { authenticateRouter };