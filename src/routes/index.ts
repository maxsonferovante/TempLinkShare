import { Router } from "express";

import { userRouter } from "./userRouter";
import { authenticateRouter } from "./authenticateRouter"
import { uploadRouter } from "./uploadRouter"

const routes = Router();

routes.use("/user", userRouter);
routes.use("/authenticate", authenticateRouter);
routes.use("/file", uploadRouter)

export { routes };