import { Publisher, Subjects, TicketCreatedEvent } from '@node-microservices/common'; 

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}