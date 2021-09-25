import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

declare global {
    var signin: () => Promise<string[]>;
}

beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();

    await mongoose.connect(mongo.getUri())
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

global.signin = async () => {
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(201);

    return response.get("Set-Cookie");
}