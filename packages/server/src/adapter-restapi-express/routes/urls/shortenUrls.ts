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
    const sU = new ShortenUrls();
    return [sU.validate.bind(sU), sU.handle.bind(sU)];
  }

  validate(req: Request, res: Response, next: NextFunction) {
    const result = this.getValidationResult(req);
    if (this.hasError(result)) next(this.buildInvalidUrlError());
    else next();
  }

  private getValidationResult(req) {
    const schema = Joi.string().allow('');
    const result = schema.validate(req.body.url);
    return result;
  }

  private hasError(result: Joi.ValidationResult<string>) {
    return result.error;
  }

  private buildInvalidUrlError(): ValidationError {
    return new ValidationError(ValidationMessages.URL_INVALID);
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      await this.tryHandle(req, res);
    } catch (error) {
      next(error);
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

  private respond(res: Response, status: number, body) {
    res.status(status);
    res.json(body);
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
}
