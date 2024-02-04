import { Router, Request, Response } from "express";

import { authenticateUserController } from "../useCases/AuthenticateUser";


const authenticateRouter = Router();


authenticateRouter.post(
    "/login",
    (request: Request, response: Response) => {
        return authenticateUserController.handle(request, response);
    }
);

authenticateRouter.get(
    "/refresh",
    (request: Request, response: Response) => {
        return authenticateUserController.refreshtoken(request, response);}
);

export { authenticateRouter };