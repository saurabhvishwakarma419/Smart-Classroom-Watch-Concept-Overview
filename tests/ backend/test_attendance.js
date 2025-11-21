const request = require('supertest');
const app = require('../../backend/server');
const { expect } = require('chai');

describe('Attendance API Tests', () => {
    let authToken;
    let studentId;

    before(async () => {
        // Login and get auth token
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@student.com',
                password: 'testpass123'
            });
        
        authToken = res.body.token;
        studentId = res.body.user.id;
    });

    describe('POST /api/attendance/mark', () => {
        it('should mark attendance successfully', async () => {
            const res = await request(app)
                .post('/api/attendance/mark')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    studentId: studentId,
                    classId: 'CLASS_001',
                    nfcTagId: 'A1B2C3D4',
                    location: 'Room 205',
                    deviceMac: 'AA:BB:CC:DD:EE:FF'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('attendance');
        });

        it('should reject duplicate attendance', async () => {
            // Mark attendance twice
            await request(app)
                .post('/api/attendance/mark')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    studentId: studentId,
                    classId: 'CLASS_001',
                    nfcTagId: 'A1B2C3D4'
                });

            const res = await request(app)
                .post('/api/attendance/mark')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    studentId: studentId,
                    classId: 'CLASS_001',
                    nfcTagId: 'A1B2C3D4'
                });

            expect(res.status).to.equal(400);
        });

        it('should reject invalid NFC tag', async () => {
            const res = await request(app)
                .post('/api/attendance/mark')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    studentId: studentId,
                    classId: 'CLASS_001',
                    nfcTagId: 'INVALID'
                });

            expect(res.status).to.equal(400);
        });
    });

    describe('GET /api/attendance/student/:studentId', () => {
        it('should get student attendance history', async () => {
            const res = await request(app)
                .get(`/api/attendance/student/${studentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('attendance');
            expect(res.body.attendance).to.be.an('array');
        });

        it('should return 404 for non-existent student', async () => {
            const res = await request(app)
                .get('/api/attendance/student/INVALID_ID')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(404);
        });
    });

    describe('GET /api/attendance/class/:classId', () => {
        it('should get class attendance', async () => {
            const res = await request(app)
                .get('/api/attendance/class/CLASS_001')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('attendance');
            expect(res.body).to.have.property('summary');
        });
    });
});
