import request from 'postman-request';
import { pingHandler } from './ping';

jest.mock('postman-request');

describe('pingHandler', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: { message: 'Hello, world!' },
    };
    res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  it('should return an object with the expected parameters', async () => {
    (request.get as jest.MockedFunction<typeof request.get>).mockImplementation((url, options, callback) => {
      callback(null, {
        statusCode: 200,
        body: {
          args: { message: 'Hello, world!' },
          headers: { 'user-agent': 'PostmanRuntime/7.28.4' },
          url: 'https://postman-echo.com/get?message=Hello%2C%20world%21',
        },
      });
    });

    await pingHandler(req, res);

    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        echo: {
          args: { message: 'Hello, world!' },
          headers: { 'user-agent': 'PostmanRuntime/7.28.4' },
          url: 'https://postman-echo.com/get?message=Hello%2C%20world%21',
        },
        timestamp: expect.any(Number),
        env: process.env.NODE_ENV,
        version: process.env.VERSION,
      })
    );
    expect(res.sendStatus).not.toBeCalled();
  });

  it('should handle errors from the echo service', async () => {
    (request.get as jest.MockedFunction<typeof request.get>).mockImplementation((url, options, callback) => {
      callback(new Error('Failed to connect to echo service'));
    });

    await pingHandler(req, res);

    expect(res.json).not.toBeCalled();
    expect(res.sendStatus).toBeCalledWith(500);
  });
});