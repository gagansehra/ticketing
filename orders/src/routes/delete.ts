import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { NotFoundError, NotAuthorizedError, OrderStatus } from '@node-microservices/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
    console.log("/api/orders/:orderId");

    const order = await Order.findOne({ _id: req.params.orderId }).populate("ticket");
    if(!order) throw new NotFoundError();

    if(order.userId != req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.send({});
});

export { router as deleteOrderRouter };