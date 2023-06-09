import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Url } from '../../src/core/url';

function createFakeUrlStorage() {
  return new FakeUrlStorage();
}

function assertUrlsMatch(url1: Url, url2: Url) {
  expect(url1).toMatchObject(url2);
}

let url1;
let url2;

beforeEach(() => {
  url1 = new Url('https://google.com', 'fe233');
  url2 = new Url('https://yahoo.com', 'fe244');
});

test('"find" returns null if there are no saves', async () => {
  const fUS = createFakeUrlStorage();

  expect(await fUS.find(url1.getLongUrl())).toBeNull();
});

test('"find" works for a saved url', async () => {
  const fUS = createFakeUrlStorage();

  await fUS.save(url1);

  const found = await fUS.find(url1.getLongUrl());
  assertUrlsMatch(found, url1);
});

test('"find" works for two saved urls', async () => {
  const fUS = createFakeUrlStorage();

  await fUS.save(url1);
  await fUS.save(url2);

  assertUrlsMatch(await fUS.find(url1.getLongUrl()), url1);
  assertUrlsMatch(await fUS.find(url2.getLongUrl()), url2);
});

test('"find" returns null if url is not saved', async () => {
  const fUS = createFakeUrlStorage();

  await fUS.save(url2);

  expect(await fUS.find(url1.getLongUrl())).toBeNull();
});
