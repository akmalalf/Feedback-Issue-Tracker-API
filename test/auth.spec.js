const request = require('supertest');
const app = require('../src/app');

describe('Protected route', () => {
  it('should reject without token', async () => {
    const res = await request(app).get('/api/feedback');
    expect(res.status).toBe(401); // sesuaikan jika middleware auth sudah terpasang
  });
});
