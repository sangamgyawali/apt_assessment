import request from 'supertest';
import app from '../index';

describe('Integration tests for /ping endpoint', () => {
  it('should return an object with the specified parameters', async () => {
    const response = await request(app)
      .post('/ping')
      .send({ message: 'Hello, world!' })
      .expect(200);

    expect(response.body).toBeObject();
    expect(response.body).toContainKeys(['echo', 'timestamp', 'env', 'version']);
    expect(response.body.echo).toContainAllKeys(['args', 'headers', 'url']);
  });
});
