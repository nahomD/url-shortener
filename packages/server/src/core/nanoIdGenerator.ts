import { IdGenerator } from './idGenerator';
import { customAlphabet } from 'nanoid/async';

export class NanoIdGenerator implements IdGenerator {
  private readonly characterLength = 9;
  private readonly alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly nanoId = customAlphabet(this.alphabet, this.characterLength);

  generateId() {
    return this.nanoId();
  }
}
