import { Url } from '../core/url';
import { UrlStorage } from '../core/urlStorage';

export class FakeUrlStorage implements UrlStorage {
  private urls: Array<Url> = [];

  async save(shortenedUrl: Url): Promise<void> {
    this.urls.push(shortenedUrl);
  }

  async findByLongUrl(longUrl: string): Promise<Url> {
    return this.findLongUrl(longUrl);
  }

  private findLongUrl(longUrl: string) {
    return this.urls.find((e) => e.getLongUrl() === longUrl) || null;
  }

  async findById(id: string): Promise<Url> {
    return this.findId(id);
  }

  private findId(id: string): Url {
    return this.urls.find((e) => e.getShortenedId() === id) || null;
  }
}
