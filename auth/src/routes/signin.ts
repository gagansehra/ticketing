import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@node-microservices/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
const router = express.Router();

const validations = [
    body('email')
        .isEmail()
        .withMessage("Email is not valid."),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
];
router.post("/api/users/signin", validations, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    console.log("/api/users/signin");

    const { email, password } = req.body;

    //checking user
    const user = await User.findOne({ email });
    if(!user) {
        throw new BadRequestError("Invalid login credentials !!");
    }

    const passwordMatch = await Password.compare(user.password, password);
    if(!passwordMatch) {
        throw new BadRequestError("Invalid login credentials !!");
    }

    //generating jwt
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, "ticket");

    //storing on session
    req.session = { jwt: userJwt };

    res.status(200).send(user);
})

export { router as signinRouter };