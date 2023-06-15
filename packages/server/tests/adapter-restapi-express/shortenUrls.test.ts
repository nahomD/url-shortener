import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { ValidationMessages } from '../../src/core/validationMessages';
import Context from '../../src/adapter-restapi-express/context';
import { GeneratorSpy } from '../core/generatorSpy';
import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';
import { ExceptionStorageStub } from './ExceptionStorageStub';
import {
  Messages,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
} from './utilities';

const longUrl = 'https://google.com';
const host = 'sh.rt';

function stubUrlIdGenerator(gSpy: GeneratorSpy) {
  Context.urlIdGenerator = gSpy;
}

function setHost(host: string) {
  process.env.HOST = host;
}

async function sendRequest(body) {
  return await request(app).post('/api/urls').send(body);
}

describe('POST /api/urls', () => {
  test('returns 400 with proper message for invalid url', async () => {
    const response = await sendRequest({ url: 'invalid url' });

    assertBadRequestWithMessage(response, ValidationMessages.URL_INVALID);
  });

  test('responds 400 with proper message for empty url', async () => {
    const response = await sendRequest({ url: '' });

    assertBadRequestWithMessage(response, ValidationMessages.URL_REQUIRED);
  });

  test('responds 400 with proper message for undefined url', async () => {
    const response = await sendRequest({});

    assertBadRequestWithMessage(response, ValidationMessages.URL_REQUIRED);
  });

  test('responds 201 with proper body for a valid long url', async () => {
    const gSpy = new GeneratorSpy();
    stubUrlIdGenerator(gSpy);

    setHost(host);
    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 201);
    assertBody(response, {
      longUrl,
      shortUrl: `https://${host}/${gSpy.generatedId}`,
    });
  });

  test('responds 500 for non validation exception', async () => {
    Context.urlStorage = new ExceptionStorageStub();

    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 500);
    assertBody(response, {
      message: Messages.SERVER_ERROR,
    });
  });

  test('responds 200 for a preexisting url', async () => {
    const stub = new PreexistingStorageStub();
    const preexistingUrl = stub.preexistingUrl;
    Context.urlStorage = stub;

    setHost(host);
    const response = await sendRequest({ url: preexistingUrl.getLongUrl() });

    assertStatusCode(response, 200);
    assertBody(response, {
      longUrl: preexistingUrl.getLongUrl(),
      shortUrl: `https://${host}/${preexistingUrl.getShortenedId()}`,
    });
  });

  test('responds 400 if url is not string', async () => {
    const response = await sendRequest({ url: 1234 });

    assertBadRequestWithMessage(response, ValidationMessages.URL_INVALID);
  });
});

class PreexistingStorageStub implements UrlStorage {
  preexistingUrl = new Url(longUrl, 'f1234');

  findById(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }

  async findByLongUrl() {
    return this.preexistingUrl;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async save() {}
}
