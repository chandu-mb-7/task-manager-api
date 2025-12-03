const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');

let token;

beforeAll(async () => {
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_manager_test';
    process.env.JWT_SECRET = 'testsecret';
    await connectDB();
    await mongoose.connection.db.dropDatabase();

    // Register & login
    await request(app).post('/users/register').send({
        name: 'Task User',
        email: 'task@example.com',
        password: 'password123'
    });

    const loginRes = await request(app).post('/users/login').send({
        email: 'task@example.com',
        password: 'password123'
    });

    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Task Routes', () => {
    it('should create and list tasks', async () => {
        const createRes = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'My task',
                priority: 'High',
                status: 'Pending'
            });

        expect(createRes.statusCode).toBe(201);
        expect(createRes.body).toHaveProperty('_id');

        const listRes = await request(app)
            .get('/tasks?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`);

        expect(listRes.statusCode).toBe(200);
        expect(Array.isArray(listRes.body.data)).toBe(true);
        expect(listRes.body.total).toBe(1);
    });
});
