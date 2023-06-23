import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Click } from '../../src/core/click';
import {
  TotalClicksUseCase,
  TotalClicksUseCaseResponse,
} from '../../src/core/totalClicksUseCase';
import { UrlId } from '../../src/core/urlId';
import {
  assertValidationErrorWithMessage,
  getDateString,
  getTodayString,
} from './utilities';

let storage;

function createUseCase() {
  return new TotalClicksUseCase(storage);
}

function assertObjectEquality(obj1, obj2) {
  expect(obj1).toEqual(obj2);
}

beforeEach(() => {
  storage = new FakeUrlStorage();
});

test('throw if id is empty', async () => {
  const tCU = createUseCase();

  await assertValidationErrorWithMessage(
    () => tCU.getTotalClicksPerDay(''),
    'Id is required'
  );
});

test.each(['invalid id', '-_3456789'])(
  'throw if id is invalid',
  async (invalidId) => {
    const tCU = createUseCase();

    await assertValidationErrorWithMessage(
      () => tCU.getTotalClicksPerDay(invalidId),
      'Id is invalid'
    );
  }
);

test('returns correct response for zero clicks', async () => {
  const tCU = createUseCase();

  const response = await tCU.getTotalClicksPerDay('googleId1');

  expect(response).toEqual({
    totalClicks: 0,
    dailyClickCounts: [],
  });
});

test('returns correct response for one click', async () => {
  const id = 'googleId1';
  storage.saveClick(new Click(new UrlId(id), new Date()));
  const tCU = createUseCase();

  const response = await tCU.getTotalClicksPerDay(id);

  assertObjectEquality(response, {
    totalClicks: 1,
    dailyClickCounts: [{ day: getTodayString(), totalClicks: 1 }],
  });
});

test('returns correct response for two clicks of the same id', async () => {
  const id = 'googleId1';
  const d = new Date(1999, 1, 1);
  storage.saveClick(new Click(new UrlId(id), d));
  storage.saveClick(new Click(new UrlId(id), new Date()));
  const tCU = createUseCase();

  const response = await tCU.getTotalClicksPerDay(id);

  assertObjectEquality(response, {
    totalClicks: 2,
    dailyClickCounts: [
      { day: getDateString(d), totalClicks: 1 },
      { day: getTodayString(), totalClicks: 1 },
    ],
  });
});

test('returns correct response for two clicks of different id', async () => {
  const id1 = 'googleId1';
  const id2 = 'googleId2';
  const d = new Date(1999, 1, 1);
  storage.saveClick(new Click(new UrlId(id1), new Date()));
  storage.saveClick(new Click(new UrlId(id2), d));
  const tCU = createUseCase();

  const response1 = await tCU.getTotalClicksPerDay(id1);
  const response2 = await tCU.getTotalClicksPerDay(id2);

  assertObjectEquality(response1, {
    totalClicks: 1,
    dailyClickCounts: [{ day: getTodayString(), totalClicks: 1 }],
  });
  assertObjectEquality(response2, {
    totalClicks: 1,
    dailyClickCounts: [{ day: getDateString(d), totalClicks: 1 }],
  });
});
