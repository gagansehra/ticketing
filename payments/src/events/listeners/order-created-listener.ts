import { Listener, OrderCreatedEvent, Subjects } from "@node-microservices/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = "payments-service";
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            status: data.status,
            version: data.version,
            price: data.ticket.price,
            userId: data.userId
        });
        await order.save();

        msg.ack();
    }
}