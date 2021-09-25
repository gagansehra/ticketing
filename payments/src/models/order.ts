import mongoose from 'mongoose';
import { OrderStatus } from '@node-microservices/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
    id: string,
    userId: string,
    status: OrderStatus,
    price: Number,
    version: number
}

interface OrderDoc extends mongoose.Document {
    userId: string,
    status: OrderStatus,
    price: Number,
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const schema = new mongoose.Schema({
    userId: String,
    status: String,
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
schema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price,
        version: attrs.version
    });
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", schema);

export { Order }