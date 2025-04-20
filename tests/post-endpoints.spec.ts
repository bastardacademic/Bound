import request from 'supertest';
import { createServer } from 'http';
import handler from '../backend/pages/api/posts/[type]';

let server;
beforeAll(() => {
  server = createServer((req, res) => handler(req, res));
  server.listen(4000);
});
afterAll(() => server.close());

describe('POST /api/posts/journal', () => {
  it('rejects unauthorized', async () => {
    const res = await request(server)
      .post('/api/posts/journal')
      .send({ text: 'Hello', tags: [], privacy: 'PRIVATE', category: 'Private' });
    expect(res.status).toBe(401);
  });
});
