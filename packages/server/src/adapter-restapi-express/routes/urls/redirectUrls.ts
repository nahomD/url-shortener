import { Request, RequestHandler, Response } from 'express';
import { RedirectUseCase } from '../../../core/redirectUseCase';
import Context from '../../context';
import { ValidationError } from '../../../core/validationError';

export class RedirectUrls {
  static getHandlers(): Array<RequestHandler> {
    const gLU = new RedirectUrls();
    return [gLU.handle.bind(gLU)];
  }

  async handle(req: Request, res: Response) {
    try {
      const uC = this.buildUseCase();
      const redirectUrl = await uC.execute(req.params.id);
      this.redirect(res, redirectUrl);
    } catch (error) {
      if (this.isValidationError(error)) {
        this.respond(res, 400, {
          message: error.message,
        });
      } else {
        this.respond(res, 500, {
          message: 'Server Error',
        });
      }
    }
  }

  private redirect(res: Response, redirectUrl: string) {
    res.redirect(301, redirectUrl);
  }

  private respond(res: Response, status: number, body: unknown) {
    res.status(status);
    res.json(body);
  }

  private isValidationError(error: Error) {
    return error instanceof ValidationError;
  }

  private buildUseCase() {
    return new RedirectUseCase(Context.urlStorage);
  }
}
