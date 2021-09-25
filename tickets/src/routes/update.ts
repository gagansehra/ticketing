import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@node-microservices/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
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
router.put("/api/tickets/:id", requireAuth, validateRequest, validations, async (req: Request, res: Response) => {
    console.log("/api/tickets/:id");

    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }

    if(req.currentUser!.id != ticket.userId) {
        throw new NotAuthorizedError();
    }

    if(ticket.orderId) {
        throw new BadRequestError("You cannot edit a reserved ticket !!");
    }

    const { title, price } = req.body;
    ticket.set({
        title,
        price
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client)
        .publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

    res.send({ ticket });
})

export { router as updateTicketRouter };