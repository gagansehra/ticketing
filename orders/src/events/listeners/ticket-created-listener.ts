import { Listener, Subjects, TicketCreatedEvent } from "@node-microservices/common";
import { Message } from "node-nats-streaming";
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = "orders-service";

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        let { title, price } = data;
        let _id = data.id;
        let ticket = Ticket.build({
            _id, title, price
        });
        await ticket.save();
        msg.ack();
    }
}