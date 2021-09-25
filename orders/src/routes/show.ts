import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { NotAuthorizedError, requireAuth, NotFoundError } from '@node-microservices/common';

const router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
    console.log("/api/orders/:orderId");

    const order = await Order.findOne({ _id: req.params.orderId })
        .populate("ticket");
    if(!order) throw new NotFoundError();

    if(order.userId != req.currentUser!.id) throw new NotAuthorizedError();

    res.send({ order });
});

export { router as showOrderRouter };