import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    try{
        const envVariables = ['MONGO_URI', 'NATS_URL', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID'];
        for(let v of envVariables) {
            if(!process.env[v]) {
                throw new Error(v + " is not defined");
            }
        }

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        await mongoose.connect(process.env.MONGO_URI!);

        // for shutting down nats client
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        console.log("Connected Payments Service to MongoDB");
    } catch(err: any) {
        console.log("ERROR IN STARTING SERVICE", err.message);
    }

    const PORT: number = 3000;
    app.listen(PORT, () => {
        console.log("RUNNING ON PORT " + PORT);
    })
} 

start();