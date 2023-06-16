import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Joi from 'joi';
import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../../core/shortenUseCase';
import Context from '../../context';
import { ValidationError } from '../../../core/validationError';
import { ValidationMessages } from '../../../core/validationMessages';

export class ShortenUrls {
  static getHandlers(): Array<RequestHandler> {
    const pU = new ShortenUrls();
    return [pU.validate.bind(pU), pU.handle.bind(pU)];
  }

  validate(req: Request, res: Response, next: NextFunction) {
    const result = this.getValidationResult(req);
    if (result.error)
      this.respond400WithValidationMessage(res, ValidationMessages.URL_INVALID);
    else next();
  }

  private getValidationResult(req) {
    const schema = Joi.string().allow('');
    const result = schema.validate(req.body.url);
    return result;
  }

  async handle(req: Request, res: Response) {
    try {
      await this.tryHandle(req, res);
    } catch (error) {
      if (this.isValidationError(error))
        this.respond400WithValidationMessage(res, error.message);
      else this.respond500WithGenericMessage(res);
    }
  }

  private async tryHandle(req: Request, res: Response) {
    const uC = this.buildShortenUseCase();
    const result = await uC.execute(req.body.url);
    this.respondWithResult(res, result);
  }

  private buildShortenUseCase() {
    return new ShortenUseCase(Context.urlStorage, Context.urlIdGenerator);
  }

  private respondWithResult(res: Response, result: ShortenUseCaseResponse) {
    this.respond(res, this.calculateStatus(result), this.buildBody(result));
  }

  private calculateStatus(result: ShortenUseCaseResponse) {
    return result.preexisting ? 200 : 201;
  }

  private buildBody(result: ShortenUseCaseResponse) {
    return {
      longUrl: result.longUrl,
      shortUrl: this.buildShortUrl(result.shortenedId),
    };
  }

  private buildShortUrl(shortenedId: string) {
    return `https://${process.env.DOMAIN}/${shortenedId}`;
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
