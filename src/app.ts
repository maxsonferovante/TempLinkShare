import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import express from "express";

import { userRouter } from "./routes/userRouter";
import { authenticateRouter } from "./routes/authenticateRouter"
import { uploadRouter } from "./routes/uploadRouter"

const app = express();

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