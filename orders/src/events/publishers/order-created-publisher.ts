import { Publisher, Subjects, OrderCreatedEvent } from '@node-microservices/common'; 

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}