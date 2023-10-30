import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import express from "express";

import { userRouter } from "./routes/userRouter";
import { authenticateRouter } from "./routes/authenticateRouter"
import { uploadRouter } from "./routes/uploadRouter"

import { ExpirationServiceCronJob } from "./services/ExpirationService/ExpirarionServiceCronJob"

const app = express();

// inicia a tarefa de verificação de expiração de arquivos, de acordo com o tempo definido no arquivo .env
// start the task of checking the expiration of files, according to the time defined in the .env file
ExpirationServiceCronJob.getInstance().start();

app.use(express.json());

app.use("/user", userRouter);
app.use("/authenticate", authenticateRouter);
app.use("/file", uploadRouter)


app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return response.status(400).json({
            error: err.message
        });
    }
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
});

export { app };