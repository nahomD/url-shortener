import { RequestHandler, Response } from 'express';
import { ValidationError } from '../../core/validationError';

export class ErrorHandler {
  static getHandlers(): Array<RequestHandler> {
    const eH = new ErrorHandler();
    return [eH.handle.bind(eH)];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(error, req, res, next) {
    if (this.isValidationError(error))
      this.respond400WithValidationMessage(res, error.message);
    else this.respond500WithGenericMessage(res);
  }

  private isValidationError(error: unknown) {
    return error instanceof ValidationError;
  }

  private respond400WithValidationMessage(res: Response, message: string) {
    this.respond(res, 400, { message });
  }

  private respond500WithGenericMessage(res: Response) {
    this.respond(res, 500, { message: 'Server Error' });
  }

  private respond(res: Response, status: number, body) {
    res.status(status);
    res.json(body);
  }
}
