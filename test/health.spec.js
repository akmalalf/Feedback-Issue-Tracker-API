const request = require('supertest');
const app = require('../src/app');

describe('Health', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
