import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../src/core/shortenUseCase';
import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';
import { ValidationError } from '../../src/core/validationError';
import { ValidationMessages } from '../../src/core/validationMessages';
import { GeneratorStub } from './generatorStub';

let storageSpy: StorageSpy;
let generatorStub: GeneratorStub;
let validUrl: string;

function createUseCase() {
  return new ShortenUseCase(storageSpy, generatorStub);
}

function assertSpyWasCalledWithProperArgument() {
  expect(storageSpy.saveWasCalled).toBe(true);
  expect(storageSpy.savedShortenedUrl).toMatchObject({
    longUrl: validUrl,
    shortenedId: generatorStub.generatedId,
  });
}

async function assertValidationErrorWithMessage(
  task: () => Promise<ShortenUseCaseResponse>,
  message: string
) {
  await expect(task()).rejects.toThrowError(message);
  await expect(task()).rejects.toThrowError(ValidationError);
}

function assertGeneratorAndSaveWereNotCalled() {
  expect(storageSpy.saveWasCalled).toBe(false);
  expect(generatorStub.wasCalled).toBe(false);
}

function assertResponsesMatch(
  response1: ShortenUseCaseResponse,
  response2: ShortenUseCaseResponse
) {
  expect(response1).toMatchObject(response2);
}

beforeEach(() => {
  storageSpy = new StorageSpy();
  generatorStub = new GeneratorStub();
  validUrl = 'https://google.com';
});

test('throws if url is empty', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(
    () => uC.execute(''),
    ValidationMessages.URL_REQUIRED
  );
});

test('throws if url is undefined', async () => {
  const uC = createUseCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let url: any;

  await assertValidationErrorWithMessage(
    () => uC.execute(url),
    ValidationMessages.URL_REQUIRED
  );
});

test('throws if url is not valid http', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(
    () => uC.execute('invalid url'),
    ValidationMessages.URL_INVALID
  );
});

test('saves shortened url', async () => {
  const uC = createUseCase();

  await uC.execute(validUrl);

  assertSpyWasCalledWithProperArgument();
});

test('returns appropriate response', async () => {
  const uC = createUseCase();

  const response = await uC.execute(validUrl);

  assertResponsesMatch(response, {
    longUrl: validUrl,
    shortenedId: generatorStub.generatedId,
    preexisting: false,
  });
});

test('does not generate shortened id and does not save already registered long url', async () => {
  const uC = createUseCase();

  await uC.execute(storageSpy.preexistingUrl.getLongUrl());

  assertGeneratorAndSaveWereNotCalled();
});

test('returns the url of already registered long url', async () => {
  const uC = createUseCase();

  const response = await uC.execute(storageSpy.preexistingUrl.getLongUrl());

  assertResponsesMatch(response, {
    longUrl: storageSpy.preexistingUrl.getLongUrl(),
    shortenedId: storageSpy.preexistingUrl.getShortenedId(),
    preexisting: true,
  });
});

class StorageSpy implements UrlStorage {
  saveWasCalled = false;
  savedShortenedUrl: Url;
  preexistingUrl = new Url('https://yahoo.com', 'fe23fe');

  findById(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }

  async save(shortenedUrl: Url) {
    this.saveWasCalled = true;
    this.savedShortenedUrl = shortenedUrl;
  }

  async findByLongUrl(longUrl: string): Promise<Url | null> {
    if (longUrl === this.preexistingUrl.getLongUrl())
      return this.preexistingUrl;
    return null;
  }
}
