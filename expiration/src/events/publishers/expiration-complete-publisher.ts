import { Publisher, Subjects, ExpirationCompleteEvent } from '@node-microservices/common'; 

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}