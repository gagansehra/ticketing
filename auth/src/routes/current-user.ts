import express, { NextFunction, Request, Response } from 'express';
import { currentUser } from '@node-microservices/common';
const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response, next: NextFunction) => {
    console.log("/api/users/currentuser");

    res.send({ currentUser: req.currentUser || null });
})

export { router as currentUserRouter };