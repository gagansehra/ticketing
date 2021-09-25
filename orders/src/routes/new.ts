import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@node-microservices/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validations = [
    body("ticketId")
        .not()
        .isEmpty()
        .withMessage("Ticket ID not provided !!")
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
];
router.post("/api/orders", requireAuth, validations, validateRequest, async (req: Request, res: Response) => {
    console.log("/api/orders");

    // find the ticket the user is trying to order
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ _id: ticketId });
    if(!ticket) throw new NotFoundError();

    // check ticket must not be already reserved
    const isReserved = await ticket.isReserved();
    if(isReserved) throw new BadRequestError("Ticket is already reserved !!");

    // calculate expiration time for order
    let expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + (1 * 60));

    // build a order
    const order = Order.build({
        userId: req.currentUser!.id,
        ticket,
        expiresAt,
        status: OrderStatus.Created
    });
    await order.save();

    // publishing order created event
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send({ order })
});

export { router as createOrderRouter };