import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../src/core/shortenUseCase';
import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';
import { ShortenerService } from '../../src/core/shortenerService';
import { ValidationError } from '../../src/core/validationError';
import { ValidationMessages } from '../../src/core/validationMessages';

let storageSpy: StorageSpy;
let shortenerStub: ShortenerStub;
let validUrl: string;

function createUseCase() {
  return new ShortenUseCase(storageSpy, shortenerStub);
}

function assertSpyWasCalledWithProperArgument() {
  expect(storageSpy.saveWasCalled).toBe(true);
  expect(storageSpy.savedShortenedUrl).toMatchObject({
    longUrl: validUrl,
    shortenedId: shortenerStub.shortenedId,
  });
}

async function assertValidationErrorWithMessage(
  task: () => Promise<ShortenUseCaseResponse>,
  message: string
) {
  await expect(task()).rejects.toThrowError(message);
  await expect(task()).rejects.toThrowError(ValidationError);
}

function assertShortenerAndSaveWasNotCalled() {
  expect(storageSpy.saveWasCalled).toBe(false);
  expect(shortenerStub.wasCalled).toBe(false);
}

function assertResponsesMatch(
  response1: ShortenUseCaseResponse,
  response2: ShortenUseCaseResponse
) {
  expect(response1).toMatchObject(response2);
}

beforeEach(() => {
  storageSpy = new StorageSpy();
  shortenerStub = new ShortenerStub();
  validUrl = 'https://google.com';
});

test('throws if url is empty', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(
    () => uC.execute(''),
    ValidationMessages.URL_EMPTY
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
    shortenedId: shortenerStub.shortenedId,
  });
});

test('does not generate shortened id and does not save already registered long url', async () => {
  const uC = createUseCase();

  await uC.execute(storageSpy.preexistingUrl.getLongUrl());

  assertShortenerAndSaveWasNotCalled();
});

test('returns the url of already registered long url', async () => {
  const uC = createUseCase();

  const response = await uC.execute(storageSpy.preexistingUrl.getLongUrl());

  assertResponsesMatch(response, {
    longUrl: storageSpy.preexistingUrl.getLongUrl(),
    shortenedId: storageSpy.preexistingUrl.getShortenedId(),
  });
});

class StorageSpy implements UrlStorage {
  saveWasCalled = false;
  savedShortenedUrl: Url;
  preexistingUrl = new Url('https://yahoo.com', 'fe23fe');

  async save(shortenedUrl: Url) {
    this.saveWasCalled = true;
    this.savedShortenedUrl = shortenedUrl;
  }

  async find(longUrl: string): Promise<Url | null> {
    if (longUrl === this.preexistingUrl.getLongUrl())
      return this.preexistingUrl;
    return null;
  }
}

class ShortenerStub implements ShortenerService {
  wasCalled = false;
  shortenedId = 'fe2344';
  generateShortenedId(): string {
    this.wasCalled = true;
    return this.shortenedId;
  }
}
