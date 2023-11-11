import { Router } from "express";

import { userRouter } from "./userRouter";
import { authenticateRouter } from "./authenticateRouter"
import { fileRouter } from "./fileRouter"

const routes = Router();

routes.use("/user", userRouter);
routes.use("/authenticate", authenticateRouter);
routes.use("/file", fileRouter)

export { routes };