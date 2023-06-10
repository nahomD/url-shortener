import { IdGenerator } from './idGenerator';
import { nanoid } from 'nanoid/async';

export class NanoIdGenerator implements IdGenerator {
  private readonly characterLength = 9;

  async generateId(): Promise<string> {
    return nanoid(this.characterLength);
  }
}
