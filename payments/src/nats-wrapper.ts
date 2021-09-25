import nats, { Stan } from 'node-nats-streaming';

/**
 * This is kind of similar implementation as of mongoose
 * we just connect with mongoose in index file and then that can be used in entire of our project
 * this concept is known as singleton, when an instance of any class is shared.
 */
class NatsWrapper{
    private _client?: Stan;

    get client() {
        if(!this._client) {
            throw new Error("You must establish a connection before accessinng nats client");
        }

        return this._client;
    }

    connect(clustedId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clustedId, clientId, { url });

        return new Promise((resolve, reject) => {
            this.client.on("connect", () => {
                console.log("Connected to NATS for Tickets Service");
                resolve();
            });

            this.client.on("error", (err) => {
                reject(err);
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();