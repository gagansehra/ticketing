import { Publisher, Subjects, OrderCompletedEvent } from '@node-microservices/common'; 

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
    readonly subject = Subjects.OrderCompleted;
}