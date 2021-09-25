import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@node-microservices/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { OrderCompletedPublisher } from '../events/publishers/order-completed-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Payment } from '../models/payment';

const router = express.Router();

const validations = [
    body("token").not().isEmpty(),
    body("orderId").not().isEmpty()
];
router.post("/api/payments", requireAuth, validations, validateRequest, async function(req: Request, res: Response) {
    console.log("POST /api/payments");

    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if(!order) throw new NotFoundError();

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order is cancelled !!");
    }

    // creating a charge
    const charge = await stripe.charges.create({
        currency: "usd",
        amount: (order.price as number) * 100,
        source: token,
        description: "For order with ID " + order._id
    });

    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });
    await payment.save();

    // completing a order
    await order.update({ status: OrderStatus.Completed });

    // publishing order completed event
    await new OrderCompletedPublisher(natsWrapper.client).publish({
        id: order._id,
        version: order.version
    });

    res.send({ success: true });
});

export { router as createChargeRouter }