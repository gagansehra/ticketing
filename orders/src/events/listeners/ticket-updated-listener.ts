import { Listener, Subjects, TicketUpdatedEvent } from "@node-microservices/common";
import { Message } from "node-nats-streaming";
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = "orders-service";

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findOne({ _id: data.id, version: data.version - 1 });
        if(!ticket) {
            throw new Error(`Ticket not found with id ${data.id} and version: ${data.version} !!`);
        }

        let { title, price } = data;
        ticket.set({
            title, price
        });
        await ticket.save();
        msg.ack();
    }
}