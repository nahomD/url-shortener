import { IdGenerator } from '../../src/core/idGenerator';

export class GeneratorSpy implements IdGenerator {
  wasCalled = false;
  generatedId = 'fe2344';
  async generateId() {
    this.wasCalled = true;
    return this.generatedId;
  }
}
