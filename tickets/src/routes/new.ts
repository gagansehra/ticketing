import { requireAuth, validateRequest } from '@node-microservices/common';
import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validations = [
    body('title')
        .not()
        .isEmpty()
        .withMessage("Title is required"),
    
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0")
];
router.post("/api/tickets", requireAuth, validations, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    console.log("/api/tickets");

    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client)
        .publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

    res.send({ ticket }).status(201);
});

export { router as createTicketRouter };