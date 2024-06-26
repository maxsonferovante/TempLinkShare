import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import express from "express";
import cors from "cors";

import swaggerUi from 'swagger-ui-express';
import { routes } from './routes';

const app = express();

app.use(cors(
    {
        origin: "*"
    }
));

app.use(express.json());
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(require('./swagger.json'))
);

app.use(routes);

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