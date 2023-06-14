import { UrlId } from './urlId';
import { Url } from './url';
import { UrlStorage } from './urlStorage';
import { ValidationError } from './validationError';
import { ValidationMessages } from './validationMessages';

export class RedirectUseCase {
  constructor(private storage: UrlStorage) {}

  async execute(id: string): Promise<string> {
    const uId = this.buildUrlId(id);
    const url = await this.findUrlById(uId);
    if (this.isNotFound(url))
      throw this.buildValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
    return url.getLongUrl();
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private async findUrlById(id: UrlId) {
    return await this.storage.findById(id.getId());
  }

  private isNotFound(url: Url) {
    return !url;
  }

  private buildValidationError(message: string) {
    return new ValidationError(message);
  }
}
