import { ValidationError } from './validationError';
import { ValidationMessages } from './validationMessages';

export class UrlId {
  constructor(private id: string) {
    if (!id) throw this.buildValidationError(ValidationMessages.ID_REQUIRED);
    if (this.isValidId(id))
      throw this.buildValidationError(ValidationMessages.ID_INVALID);
  }

  private isValidId(id: string) {
    return id.length !== 9 || id.includes('_') || id.includes('-');
  }

  private buildValidationError(message: string) {
    return new ValidationError(message);
  }

  getId(): string {
    return this.id;
  }
}
