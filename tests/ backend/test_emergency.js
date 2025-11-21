const request = require('supertest');
const app = require('../../backend/server');
const { expect } = require('chai');

describe('Emergency API Tests', () => {
    let authToken;
    let studentId;

    before(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@student.com',
                password: 'testpass123'
            });
        
        authToken = res.body.token;
        studentId = res.body.user.id;
    });

    describe('POST /api/emergency/alert', () => {
        it('should trigger SOS alert successfully', async () => {
            const res = await request(app)
                .post('/api/emergency/alert')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    studentId: studentId,
                    alertType: 'SOS',
                    location: 'Classroom 205',
                    gpsCoordinates: {
                        latitude: 28.6139,
                        longitude: 77.2090
                    }
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('alert');
        });

        it('should reject unauthorized emergency alert', async () => {
            const res = await request(app)
                .post('/api/emergency/alert')
                .send({
                    studentId: studentId,
                    alertType: 'SOS'
                });

            expect(res.status).to.equal(401);
        });
    });

    describe('GET /api/emergency/active', () => {
        it('should get active alerts (admin/teacher only)', async () => {
            // Login as teacher
            const teacherLogin = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'teacher@school.com',
                    password: 'teacherpass'
                });

            const res = await request(app)
                .get('/api/emergency/active')
                .set('Authorization', `Bearer ${teacherLogin.body.token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });
});
