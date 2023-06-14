import { Url } from './url';
import { UrlIdGenerator } from './urlIdGenerator';
import { UrlStorage } from './urlStorage';
import validUrl from 'valid-url';
import { ValidationError } from './validationError';
import { ValidationMessages } from './validationMessages';

export class ShortenUseCase {
  constructor(private storage: UrlStorage, private generator: UrlIdGenerator) {}

  async execute(longUrl: string): Promise<ShortenUseCaseResponse> {
    this.validateLongUrl(longUrl);
    const preUrl = await this.findPreexistingUrl(longUrl);
    if (preUrl) return this.buildResponseForPreexisting(preUrl);
    const newUrl = await this.createNewUrl(longUrl);
    return this.buildResponse(newUrl);
  }

  private validateLongUrl(longUrl: string) {
    if (!longUrl)
      throw this.createValidationError(ValidationMessages.URL_REQUIRED);
    else if (!validUrl.isWebUri(longUrl))
      throw this.createValidationError(ValidationMessages.URL_INVALID);
  }

  private createValidationError(message: string): ValidationError {
    return new ValidationError(message);
  }

  private async findPreexistingUrl(longUrl: string) {
    return await this.storage.findByLongUrl(longUrl);
  }

  private buildResponseForPreexisting(preUrl: Url): ShortenUseCaseResponse {
    return { ...this.buildResponse(preUrl), preexisting: true };
  }

  private async createNewUrl(longUrl: string) {
    const shortenedId = await this.generateShortenedId();
    const url = this.buildUrl(longUrl, shortenedId);
    await this.saveUrl(url);
    return url;
  }

  private async generateShortenedId() {
    return (await this.generator.generateUrlId()).getId();
  }

  private buildUrl(longUrl: string, shortenedId: string) {
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
      preexisting: false,
    };
  }
}

export interface ShortenUseCaseResponse {
  longUrl: string;
  shortenedId: string;
  preexisting: boolean;
}
