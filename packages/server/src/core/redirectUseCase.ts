import { Url } from './url';
import { UrlStorage } from './urlStorage';
import { ValidationError } from './validationError';
import { ValidationMessages } from './validationMessages';

export class RedirectUseCase {
  constructor(private storage: UrlStorage) {}

  async execute(shortenedId: string): Promise<string> {
    this.validateId(shortenedId);
    const url = await this.findUrlById(shortenedId);
    if (this.isNotFound(url))
      throw this.buildValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
    return url.getLongUrl();
  }

  private validateId(shortenedId: string) {
    if (!shortenedId)
      throw this.buildValidationError(ValidationMessages.ID_REQUIRED);
    if (this.isValidId(shortenedId))
      throw this.buildValidationError(ValidationMessages.ID_INVALID);
  }

  private isValidId(shortenedId: string) {
    return (
      shortenedId.length !== 9 ||
      shortenedId.includes('_') ||
      shortenedId.includes('-')
    );
  }

  private async findUrlById(shortenedId: string) {
    return await this.storage.findById(shortenedId);
  }

  private isNotFound(url: Url) {
    return !url;
  }

  private buildValidationError(message: string) {
    return new ValidationError(message);
  }
}
