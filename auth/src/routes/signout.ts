import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response, next: NextFunction) => {
    console.log('/api/users/signout')

    req.session = null;
    res.status(200).send({ message: "Success" });
})

export { router as signoutRouter };