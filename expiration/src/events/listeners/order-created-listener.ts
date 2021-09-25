import { Listener, OrderCreatedEvent, Subjects } from '@node-microservices/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = "expiration-service";

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log("Waiting for", delay, 'miliseconds for processing a new expiration job');

        // adding job for order expiration
        await expirationQueue.add({ orderId: data.id }, {
            delay
        });

        msg.ack();
    }
}

export { OrderCreatedListener };