import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Click } from '../../src/core/click';
import { TotalClicksUseCase } from '../../src/core/totalClicksUseCase';
import { Url } from '../../src/core/url';
import { UrlId } from '../../src/core/urlId';
import { assertValidationErrorWithMessage, getDateString } from './utilities';

let storage;
const validId1 = 'googleId1';
const validId2 = 'googleId2';
const clickDate1 = new Date();
const clickDate2 = new Date(1999, 1, 1);

const ID_REQUIRED = 'Id is required';
const ID_INVALID = 'Id is invalid';
const ID_DOES_NOT_EXIST = 'Id does not exist';

function saveUrlAndClickItOnce() {
  saveUrl(validId1);
  saveClick(validId1, clickDate1);
}

function saveUrlAndClickItTwice() {
  saveUrl(validId1);
  saveClick(validId1, clickDate2);
  saveClick(validId1, clickDate1);
}

function saveTwoUrlsAndClickBothOnce() {
  saveUrl(validId1);
  saveClick(validId1, clickDate1);
  saveUrl(validId2, 'https://google2.com');
  saveClick(validId2, clickDate2);
}

function saveUrl(id: string, longUrl?: string) {
  storage.save(new Url(longUrl ?? 'https://google1.com', id));
}

function saveClick(id: string, clickDate: Date) {
  storage.saveClick(new Click(new UrlId(id), clickDate));
}

function createTotalClicksUseCase() {
  return new TotalClicksUseCase(storage);
}

function getTotalClicksByDay(uC: TotalClicksUseCase, id: string) {
  return uC.getTotalClicksPerDay(id);
}

function buildExpectedUseCaseResponse(
  totalClicks: number,
  dailyClickCounts: { day: string; totalClicks: number }[]
) {
  return {
    totalClicks: totalClicks,
    dailyClickCounts: dailyClickCounts,
  };
}

function assertObjectEquality(obj1, obj2) {
  expect(obj1).toEqual(obj2);
}

beforeEach(() => {
  storage = new FakeUrlStorage();
});

test('throws if id is empty', async () => {
  const uC = createTotalClicksUseCase();

  await assertValidationErrorWithMessage(
    () => getTotalClicksByDay(uC, ''),
    ID_REQUIRED
  );
});

test.each(['invalid id', '-_3456789'])(
  'throws if id is invalid',
  async (invalidId) => {
    const uC = createTotalClicksUseCase();

    await assertValidationErrorWithMessage(
      () => getTotalClicksByDay(uC, invalidId),
      ID_INVALID
    );
  }
);

test('returns correct response for zero clicks', async () => {
  saveUrl(validId1);
  const uC = createTotalClicksUseCase();

  const response = await getTotalClicksByDay(uC, validId1);

  expect(response).toEqual(buildExpectedUseCaseResponse(0, []));
});

test('returns correct response for one click', async () => {
  saveUrlAndClickItOnce();
  const uC = createTotalClicksUseCase();

  const response = await getTotalClicksByDay(uC, validId1);

  assertObjectEquality(
    response,
    buildExpectedUseCaseResponse(1, [
      { day: getDateString(clickDate1), totalClicks: 1 },
    ])
  );
});

test('returns correct response for two clicks of the same id', async () => {
  saveUrlAndClickItTwice();
  const uC = createTotalClicksUseCase();

  const response = await getTotalClicksByDay(uC, validId1);

  assertObjectEquality(
    response,
    buildExpectedUseCaseResponse(2, [
      { day: getDateString(clickDate2), totalClicks: 1 },
      { day: getDateString(clickDate1), totalClicks: 1 },
    ])
  );
});

test('returns correct response for two clicks of different id', async () => {
  saveTwoUrlsAndClickBothOnce();
  const uC = createTotalClicksUseCase();

  const response1 = await getTotalClicksByDay(uC, validId1);
  const response2 = await getTotalClicksByDay(uC, validId2);

  assertObjectEquality(
    response1,
    buildExpectedUseCaseResponse(1, [
      { day: getDateString(clickDate1), totalClicks: 1 },
    ])
  );
  assertObjectEquality(
    response2,
    buildExpectedUseCaseResponse(1, [
      { day: getDateString(clickDate2), totalClicks: 1 },
    ])
  );
});

test('throws validation error if url was not saved', async () => {
  const uC = createTotalClicksUseCase();

  await assertValidationErrorWithMessage(
    () => uC.getTotalClicksPerDay('googleId1'),
    ID_DOES_NOT_EXIST
  );
});
