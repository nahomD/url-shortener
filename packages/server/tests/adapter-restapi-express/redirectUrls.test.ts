import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { ValidationMessages } from '../../src/core/validationMessages';
import {
  Messages,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
} from './utilities';
import Context from '../../src/adapter-restapi-express/context';
import { ExceptionStorageStub } from './ExceptionStorageStub';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Url } from '../../src/core/url';

const validId = 'googleId1';

async function sendRequest(id: string) {
  return await request(app).get('/' + id);
}

describe('GET /<id>', () => {
  test('responds 400 for empty id', async () => {
    const response = await sendRequest('');

    assertBadRequestWithMessage(response, ValidationMessages.ID_REQUIRED);
  });

  test('responds 400 for invalid id', async () => {
    const response = await sendRequest('f');

    assertBadRequestWithMessage(response, ValidationMessages.ID_INVALID);
  });

  test('responds 500 for unknown exceptions', async () => {
    Context.urlStorage = new ExceptionStorageStub();

    const response = await sendRequest(validId);

    assertStatusCode(response, 500);
    assertBody(response, {
      message: Messages.SERVER_ERROR,
    });
  });

  test('responds 400 if id does not exist', async () => {
    const response = await sendRequest(validId);

    assertBadRequestWithMessage(response, ValidationMessages.ID_DOES_NOT_EXIST);
  });

  test('responds with a 301 redirect if id exists', async () => {
    const url = new Url('https://google.com', validId);
    Context.urlStorage.save(url);

    const response = await sendRequest(url.getShortenedId());

    assertStatusCode(response, 301);
    expect(response.headers.location).toBe(url.getLongUrl());
  });

  afterEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });
});
