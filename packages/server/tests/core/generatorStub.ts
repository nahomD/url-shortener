import { IdGenerator } from '../../src/core/idGenerator';

export class GeneratorStub implements IdGenerator {
  wasCalled = false;
  generatedId = 'fe2344';
  async generateId() {
    this.wasCalled = true;
    return this.generatedId;
  }
}
