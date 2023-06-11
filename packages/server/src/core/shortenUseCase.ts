import { Url } from './url';
import { IdGenerator } from './idGenerator';
import { UrlStorage } from './urlStorage';
import validUrl from 'valid-url';
import { ValidationError } from './validationError';
import { ValidationMessages } from './validationMessages';

export class ShortenUseCase {
  constructor(private storage: UrlStorage, private generator: IdGenerator) {}

  async execute(longUrl: string): Promise<ShortenUseCaseResponse> {
    this.validateLongUrl(longUrl);
    const preUrl = await this.findPreexistingUrl(longUrl);
    if (preUrl) return this.buildResponse(preUrl);
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
    return await this.storage.find(longUrl);
  }

  private async createNewUrl(longUrl: string) {
    const shortenedId = await this.generateShortenedId();
    const url = this.createUrl(longUrl, shortenedId);
    await this.saveUrl(url);
    return url;
  }

  private async generateShortenedId() {
    return await this.generator.generateId();
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
