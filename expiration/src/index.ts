import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    try{
        const envVariables = ['NATS_URL', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID'];
        for(let v of envVariables) {
            if(!process.env[v]) {
                throw new Error(v + " is not defined for expiration");
            }
        }

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);

        // listening to events
        new OrderCreatedListener(natsWrapper.client).listen();

        // for shutting down nats client
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

    } catch(err: any) {
        console.log("ERROR IN STARTING EXPIRATION SERVICE", err.message);
    }
} 

start();