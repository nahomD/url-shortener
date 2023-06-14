import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';

function createFakeUrlStorage(): UrlStorage {
  return new FakeUrlStorage();
}

function assertObjectsMatch(obj1, obj2) {
  expect(obj1).toMatchObject(obj2);
}

let url1;
let url2;

beforeEach(() => {
  url1 = new Url('https://google.com', 'fe233');
  url2 = new Url('https://yahoo.com', 'fe244');
});

test('"find" returns null if there are no saves', async () => {
  const fUS = createFakeUrlStorage();

  expect(await fUS.findByLongUrl(url1.getLongUrl())).toBeNull();
});

test('"find" works for a saved url', async () => {
  const fUS = createFakeUrlStorage();
  await fUS.save(url1);

  const found = await fUS.findByLongUrl(url1.getLongUrl());

  assertObjectsMatch(found, url1);
});

test('"find" works for two saved urls', async () => {
  const fUS = createFakeUrlStorage();

  await fUS.save(url1);
  await fUS.save(url2);

  assertObjectsMatch(await fUS.findByLongUrl(url1.getLongUrl()), url1);
  assertObjectsMatch(await fUS.findByLongUrl(url2.getLongUrl()), url2);
});

test('"find" returns null if url is not saved', async () => {
  const fUS = createFakeUrlStorage();

  await fUS.save(url2);

  expect(await fUS.findByLongUrl(url1.getLongUrl())).toBeNull();
});
