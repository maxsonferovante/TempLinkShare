import { Router } from "express";

import { userRouter } from "./userRouter";
import { authenticateRouter } from "./authenticateRouter"
import { fileRouter } from "./fileRouter"
import { sendingEmailLinkRouter } from "./sendingEmailLinkRouter"

const routes = Router();

routes.use("/user", userRouter);
routes.use("/authenticate", authenticateRouter);
routes.use("/file", fileRouter)
routes.use("/shared/email", sendingEmailLinkRouter)

export { routes };