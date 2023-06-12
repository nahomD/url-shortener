import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { ValidationMessages } from '../../src/core/validationMessages';
import Context from '../../src/adapter-restapi-express/context';
import { GeneratorStub } from '../core/generatorStub';

const longUrl = 'https://google.com';

async function sendRequest(body) {
  return await request(app).post('/api/urls').send(body);
}

function assertBadRequestWithMessage(response, message: string) {
  assertStatusCode(response, 400);
  assertBody(response, { message: message });
}

function assertStatusCode(response, statusCode: number) {
  expect(response.statusCode).toBe(statusCode);
}

function assertBody(response, body: unknown) {
  expect(response.body).toEqual(body);
}

describe('POST /api/urls', () => {
  test('returns 400 with proper message for invalid url', async () => {
    const response = await sendRequest({ url: 'invalid url' });

    assertBadRequestWithMessage(response, ValidationMessages.URL_INVALID);
  });

  test('returns 400 with proper message for empty url', async () => {
    const response = await sendRequest({ url: '' });

    assertBadRequestWithMessage(response, ValidationMessages.URL_REQUIRED);
  });

  test('returns 400 with proper message for undefined url', async () => {
    const response = await sendRequest({});

    assertBadRequestWithMessage(response, ValidationMessages.URL_REQUIRED);
  });

  test('returns 201 with proper body for a valid long url', async () => {
    const gStub = new GeneratorStub();
    Context.idGenerator = gStub;
    const domain = 'sh.rt';

    process.env.HOST = domain;
    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 201);
    assertBody(response, {
      longUrl,
      shortUrl: `https://${domain}/${gStub.generatedId}`,
    });
  });

  test('return 500 for non validation exception', async () => {
    const exception = new Error('Storage exception');
    Context.urlStorage = {
      find() {
        throw exception;
      },
      save() {
        throw exception;
      },
    };

    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 500);
    assertBody(response, {
      message: 'Server Error',
    });
  });
});
