const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Drug = require('../models/Drug');
const User = require('../models/User');

describe('ML Model Integration Tests', () => {
    let token;
    let testDrugId;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGO_URI_TEST);

        // Create test user
        const user = await User.create({
            name: 'Test Admin',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin'
        });

        // Create test drug
        const drug = await Drug.create({
            name: 'Test Drug',
            quantity: 100,
            price: 10.99,
            category: 'Test Category'
        });
        testDrugId = drug._id;

        // Login to get token
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        token = response.body.token;
    });

    afterAll(async () => {
        // Clean up test data
        await User.deleteMany({ email: 'test@example.com' });
        await Drug.deleteMany({ name: 'Test Drug' });
        await mongoose.connection.close();
    });

    test('should train the ML model', async () => {
        const response = await request(app)
            .post('/api/ml/train')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('should get predictions', async () => {
        const response = await request(app)
            .get('/api/ml/predictions?days=7')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.predictions).toBeDefined();
        expect(Array.isArray(response.body.predictions)).toBe(true);
    });

    test('should get analytics report', async () => {
        const response = await request(app)
            .get('/api/analytics/report')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.report).toBeDefined();
        expect(response.body.report.summary).toBeDefined();
    });

    test('should get drug-specific trends', async () => {
        const response = await request(app)
            .get(`/api/analytics/drug/${testDrugId}/trends`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.historical).toBeDefined();
        expect(response.body.data.predictions).toBeDefined();
    });

    test('should handle unauthorized access', async () => {
        const response = await request(app)
            .get('/api/analytics/report');

        expect(response.status).toBe(401);
    });
}); 