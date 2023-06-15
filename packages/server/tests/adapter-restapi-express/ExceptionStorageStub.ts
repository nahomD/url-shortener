import { Url } from '../../src/core/url';
import { UrlStorage } from '../../src/core/urlStorage';

export class ExceptionStorageStub implements UrlStorage {
  async findById(): Promise<Url | null> {
    throw new Error();
  }

  async findByLongUrl(): Promise<Url | null> {
    throw new Error();
  }

  async save() {
    throw new Error();
  }
}
