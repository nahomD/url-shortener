import { UrlIdGenerator } from './urlIdGenerator';
import { customAlphabet } from 'nanoid/async';
import { UrlId } from './urlId';

export class NanoIdGenerator implements UrlIdGenerator {
  private readonly characterLength = 9;
  private readonly alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly nanoId = customAlphabet(this.alphabet, this.characterLength);

  async generateUrlId(): Promise<UrlId> {
    return new UrlId(await this.nanoId());
  }
}
