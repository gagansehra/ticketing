import { Publisher, Subjects, TicketUpdatedEvent } from '@node-microservices/common'; 

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}