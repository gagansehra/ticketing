import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { OrderCompletedListener } from './events/listeners/order-completed-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    try{
        const envVariables = ['MONGO_URI', 'NATS_URL', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID'];
        for(let v of envVariables) {
            if(!process.env[v]) {
                throw new Error(v + " is not defined for Orders Service");
            }
        }

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        await mongoose.connect(process.env.MONGO_URI!);

        // for shutting down nats client
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new OrderCompletedListener(natsWrapper.client).listen();

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        console.log("Connected Orders Service to MongoDB");
    } catch(err: any) {
        console.log("ERROR IN STARTING ORDERS SERVICE", err.message);
    }

    const PORT: number = 3000;
    app.listen(PORT, () => {
        console.log("ORDERS SERVICE ON PORT " + PORT);
    })
} 

start();