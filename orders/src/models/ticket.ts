import { OrderStatus } from '@node-microservices/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';

// This defines the attributes that will be provided while inserting data in DB
interface TicketAttrs {
    _id: string;
    title: string;
    price: number;
}

// This defines the attributes that will be there when we fetch data from DB
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<Boolean>
}

// adding build method for TS
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const schema = new mongoose.Schema({
    title: String,
    price: Number
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

schema.set("versionKey", "version");
schema.plugin(updateIfCurrentPlugin);
schema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

schema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Completed,
                // OrderStatus.AwaitingPayment,
                // OrderStatus.Created
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", schema);

export { Ticket }