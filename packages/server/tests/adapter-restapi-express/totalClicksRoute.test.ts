import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import {
  Messages,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
} from './utilities';
import { ValidationMessages } from '../../src/core/validationMessages';
import { ExceptionStorageStub } from './ExceptionStorageStub';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Click } from '../../src/core/click';
import { UrlId } from '../../src/core/urlId';

const validId = 'googleId1';

async function sendRequest(id: string) {
  return await request(app).get('/api/urls/' + id + '/total-clicks-by-day');
}

describe('GET api/urls/<id>/total-clicks-by-day', () => {
  beforeEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });

  test.each(['_-3456789', '1234t7'])(
    'returns 400 for invalid id',
    async (invalidId) => {
      const response = await sendRequest(invalidId);

      assertBadRequestWithMessage(response, ValidationMessages.ID_INVALID);
    }
  );

  test('returns 500 for unknown exception', async () => {
    Context.urlStorage = new ExceptionStorageStub();

    const response = await sendRequest(validId);

    assertStatusCode(response, 500);
    assertBody(response, {
      message: Messages.SERVER_ERROR,
    });
  });

  test('returns 200 for a valid id', async () => {
    const clickDate = new Date();
    Context.urlStorage.saveClick(new Click(new UrlId(validId), clickDate));

    const response = await sendRequest(validId);

    assertStatusCode(response, 200);
    assertBody(response, {
      totalClicks: 1,
      dailyClickCounts: [
        {
          day: `${clickDate.getDate()}/${
            clickDate.getMonth() + 1
          }/${clickDate.getFullYear()}`,
          totalClicks: 1,
        },
      ],
    });
  });
});
