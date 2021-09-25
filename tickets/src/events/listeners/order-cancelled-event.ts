import { Subjects, Listener, OrderCancelledEvent } from '@node-microservices/common'; 
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = 'tickets-service';

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // find the ticket that must be unreserved
        const ticket = await Ticket.findById(data.ticket.id);

        // if ticket not found, throw error
        if(!ticket) throw new Error("Ticket not found !!");

        // if ticket found, update it with orderId
        ticket.set({ orderId: null });

        // save the ticket
        await ticket.save();

        // publish ticket updated event for other services
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            orderId: ticket.orderId,
            version: ticket.version,
            userId: ticket.userId
        });

        // ack the message
        msg.ack();
    }
}