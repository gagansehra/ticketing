import { Listener, Subjects, OrderStatus, OrderCompletedEvent } from "@node-microservices/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
    readonly subject = Subjects.OrderCompleted;
    queueGroupName = "orders-service";

    async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
        const order = await Order.findById(data.id);
        if(!order) throw new Error("Order not found");

        order.set({ status: OrderStatus.Completed });
        await order.save();

        msg.ack();
    }
}