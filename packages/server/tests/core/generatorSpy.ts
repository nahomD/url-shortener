import { UrlIdGenerator } from '../../src/core/urlIdGenerator';
import { UrlId } from '../../src/core/urlId';

export class GeneratorSpy implements UrlIdGenerator {
  wasCalled = false;
  generatedId = 'fe3456789';

  async generateUrlId(): Promise<UrlId> {
    this.wasCalled = true;
    return new UrlId(this.generatedId);
  }
}
