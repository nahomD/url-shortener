import { FakeUrlStorage } from '../adapter-persistence-fake/fakeUrlStorage';
import { IdGenerator } from '../core/idGenerator';
import { NanoIdGenerator } from '../core/nanoIdGenerator';
import { UrlStorage } from '../core/urlStorage';

export default class Context {
  static urlStorage: UrlStorage = new FakeUrlStorage();
  static idGenerator: IdGenerator = new NanoIdGenerator();
}
