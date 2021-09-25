import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@node-microservices/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

const signupValidations = [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters")
];
router.post("/api/users/signup", signupValidations, validateRequest, async(req: Request, res: Response, next: NextFunction) => {
    console.log('/api/users/signup')

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new BadRequestError("Email already in use.")
    }

    const user = User.build({ email, password });
    await user.save();

    //generating jwt
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, "ticket");

    //storing on session
    req.session = { jwt: userJwt };

    res.status(201).send(user);
})

export { router as signupRouter };