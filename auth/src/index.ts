import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log("Connected Auth Service to MongoDB");
    } catch(err: any) {
        console.log(err.message);
    }

    const PORT: number = 3000;
    app.listen(PORT, () => {
        console.log("AUTH SERVICE ON PORT " + PORT);
    })
} 

start();