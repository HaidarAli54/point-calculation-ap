import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionController (e2e)', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Mendapatkan token untuk digunakan dalam testing
        const response = await request(app.getHttpServer())
            .post('/api/user/login')
            .send({ email: 'ahmadjali@gmail.com', password: 'ahmadjali54' });
        
        // console.log('login response:', response.body);

        if (response.status !== 200 && response.status !== 201) {
            console.error('Login failed with status:', response.status);
            console.error('Login error message:', response.body);
            throw new Error('Failed to log in and retrieve token');
        }

        if (!response.body.user || !response.body.user.token) {
            console.error('Token not found in the response body:', response.body);
            throw new Error('Failed to retrieve token from the login response');
        }

        token = response.body.user.token;

    }, 30000);

    afterAll(async () => {
        await app.close();
    });

    it('/api/transaction (POST) - should create a transaction', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/transaction')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: 1, amount: 100000 });

        // console.log('create transaction response:', response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userId', 1);
        expect(response.body).toHaveProperty('amount', 100000);
    });

    it('/api/transaction/:userId (GET) - should get user transactions', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/transaction/1')
            .set('Authorization', `Bearer ${token}`);
        
        // console.log('GET User Transactions response:', response.body);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('userId', 1);
            expect(response.body[0]).toHaveProperty('amount');
        }
    });
});