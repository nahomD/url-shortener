import { Url } from './url';
import { ShortenerService } from './shortenerService';
import { UrlStorage } from './urlStorage';
import validUrl from 'valid-url';

export class ShortenUseCase {
  constructor(
    private storage: UrlStorage,
    private shortener: ShortenerService
  ) {}

  async execute(longUrl: string): Promise<ShortenUseCaseResponse> {
    this.validateLongUrl(longUrl);
    const preUrl = await this.findPreexistingUrl(longUrl);
    if (preUrl) return this.buildResponse(preUrl);
    const newUrl = await this.createNewUrl(longUrl);
    return this.buildResponse(newUrl);
  }

  private validateLongUrl(longUrl: string) {
    if (longUrl === '') throw new Error("URL can't be empty");
    else if (!validUrl.isWebUri(longUrl)) throw new Error('URL is not valid');
  }

  private async findPreexistingUrl(longUrl: string) {
    return await this.storage.find(longUrl);
  }

  private async createNewUrl(longUrl: string) {
    const shortenedId = this.generateShortenedId(longUrl);
    const url = this.createUrl(longUrl, shortenedId);
    await this.saveUrl(url);
    return url;
  }

  private generateShortenedId(longUrl: string) {
    return this.shortener.generateShortenedId(longUrl);
  }

  private createUrl(longUrl: string, shortenedId: string) {
    const url = new Url(longUrl, shortenedId);
    return url;
  }

  private async saveUrl(url: Url) {
    await this.storage.save(url);
  }

  private buildResponse(url: Url) {
    return {
      longUrl: url.getLongUrl(),
      shortenedId: url.getShortenedId(),
    };
  }
}

export interface ShortenUseCaseResponse {
  longUrl: string;
  shortenedId: string;
}
