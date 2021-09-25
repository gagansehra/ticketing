import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@node-microservices/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);

app.use(json());

// for cookies that contains jwt
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
    console.log("404", req.path);
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };