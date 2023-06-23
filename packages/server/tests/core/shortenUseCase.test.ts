import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../src/core/shortenUseCase';
import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';
import { GeneratorSpy } from './generatorSpy';
import { assertValidationErrorWithMessage } from './utilities';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import DailyClickCountStat from '../../src/core/dailyClickCountStat';

const url = new Url('https://yahoo.com', 'fe23fe');
const URL_REQUIRED = 'URL is required';
const URL_INVALID = 'URL is not valid';

let generatorSpy: GeneratorSpy;

function createUseCase(storage?: UrlStorage) {
  generatorSpy = new GeneratorSpy();
  return new ShortenUseCase(storage || createStorage(), generatorSpy);
}

function createStorage() {
  return new FakeUrlStorage();
}

async function assertUrlWasSaved(storage: FakeUrlStorage) {
  expect(await storage.findByLongUrl(url.getLongUrl())).toMatchObject(
    new Url(url.getLongUrl(), generatorSpy.generatedId)
  );
}

function assertGeneratorAndSaveWereNotCalled(storageSpy: StorageSpy) {
  expect(storageSpy.saveWasCalled).toBe(false);
  expect(generatorSpy.wasCalled).toBe(false);
}

function assertResponsesMatch(
  response1: ShortenUseCaseResponse,
  response2: ShortenUseCaseResponse
) {
  expect(response1).toMatchObject(response2);
}

test('throws if url is empty', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(() => uC.execute(''), URL_REQUIRED);
});

test('throws if url is undefined', async () => {
  const uC = createUseCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let url: any;

  await assertValidationErrorWithMessage(() => uC.execute(url), URL_REQUIRED);
});

test('throws if url is not valid http', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(
    () => uC.execute('invalid url'),
    URL_INVALID
  );
});

test('saves shortened url', async () => {
  const storage = createStorage();
  const uC = createUseCase(storage);

  await uC.execute(url.getLongUrl());

  await assertUrlWasSaved(storage);
});

test('returns correct response for a new url', async () => {
  const uC = createUseCase();

  const response = await uC.execute(url.getLongUrl());

  assertResponsesMatch(response, {
    longUrl: url.getLongUrl(),
    shortenedId: generatorSpy.generatedId,
    preexisting: false,
  });
});

test('does not save and generate id for a preexisting url', async () => {
  const spy = new StorageSpy();
  const uC = createUseCase(spy);

  await uC.execute(spy.preexistingUrl.getLongUrl());

  assertGeneratorAndSaveWereNotCalled(spy);
});

test('returns correct response for a preexisting url', async () => {
  const storage = createStorage();
  storage.save(url);
  const uC = createUseCase(storage);

  const response = await uC.execute(url.getLongUrl());

  assertResponsesMatch(response, {
    longUrl: url.getLongUrl(),
    shortenedId: url.getShortenedId(),
    preexisting: true,
  });
});

class StorageSpy implements UrlStorage {
  saveWasCalled = false;
  preexistingUrl = url;

  saveClick(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getTotalClicksByDay(): Promise<DailyClickCountStat> {
    throw new Error('Method not implemented.');
  }

  findById(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }

  async save() {
    this.saveWasCalled = true;
  }

  async findByLongUrl(): Promise<Url | null> {
    return this.preexistingUrl;
  }
}
