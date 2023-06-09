import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../src/core/shortenUseCase';
import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';
import { ShortenerService } from '../../src/core/shortenerService';

let storageSpy: StorageSpy;
let shortenerStub: ShortenerStub;

function createUseCase() {
  return new ShortenUseCase(storageSpy, shortenerStub);
}

function assertSpyWasCalledWithProperArgument() {
  expect(storageSpy.saveWasCalled).toBe(true);
  expect(storageSpy.savedShortenedUrl).toMatchObject({
    longUrl: 'https://google.com',
    shortenedId: shortenerStub.shortenedId,
  });
}

async function assertThrowWithMessage(
  task: () => Promise<ShortenUseCaseResponse>,
  message: string
) {
  await expect(task()).rejects.toThrowError(message);
}

function assertShortenerAndSaveWasNotCalled() {
  expect(storageSpy.saveWasCalled).toBe(false);
  expect(shortenerStub.wasCalled).toBe(false);
}

beforeEach(() => {
  storageSpy = new StorageSpy();
  shortenerStub = new ShortenerStub();
});

test('throws if url is empty', async () => {
  const uC = createUseCase();

  await assertThrowWithMessage(() => uC.execute(''), "URL can't be empty");
});

test('throws if url is not valid http', async () => {
  const uC = createUseCase();

  await assertThrowWithMessage(
    () => uC.execute('invalid url'),
    'URL is not valid'
  );
});

test('saves shortened url', async () => {
  const uC = createUseCase();

  await uC.execute('https://google.com');

  assertSpyWasCalledWithProperArgument();
});

test('returns appropriate response', async () => {
  const uC = createUseCase();

  const response = await uC.execute('https://google.com');

  expect(response).toMatchObject({
    longUrl: 'https://google.com',
    shortenedId: shortenerStub.shortenedId,
  });
});

test('does not generate shortened id and save already registered long url', async () => {
  const uC = createUseCase();

  await uC.execute(storageSpy.preexistingUrl.getLongUrl());

  assertShortenerAndSaveWasNotCalled();
});

test('returns the url of already registered long url', async () => {
  const uC = createUseCase();

  const response = await uC.execute(storageSpy.preexistingUrl.getLongUrl());

  expect(response).toMatchObject(storageSpy.preexistingUrl);
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
