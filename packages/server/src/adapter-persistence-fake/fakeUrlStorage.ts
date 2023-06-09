import { Url } from '../core/url';
import { UrlStorage } from '../core/urlStorage';

export class FakeUrlStorage implements UrlStorage {
  private urls: Array<Url> = [];

  async save(shortenedUrl: Url): Promise<void> {
    this.urls.push(shortenedUrl);
  }

  async find(longUrl: string): Promise<Url> {
    return this.findUrl(longUrl);
  }

  private findUrl(longUrl: string) {
    return this.urls.find((e) => e.getLongUrl() === longUrl) || null;
  }
}
