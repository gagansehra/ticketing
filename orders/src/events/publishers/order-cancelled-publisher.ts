import { Publisher, Subjects, OrderCancelledEvent } from '@node-microservices/common'; 

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}