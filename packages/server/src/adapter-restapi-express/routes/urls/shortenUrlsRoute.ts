import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Joi from 'joi';
import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../../core/shortenUseCase';
import Context from '../../context';
import { ValidationError } from '../../../core/validationError';
import { ValidationMessages } from '../../../core/validationMessages';

export class ShortenUrlsRoute {
  static getHandlers(): Array<RequestHandler> {
    const sU = new ShortenUrlsRoute();
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
    const response = await this.getResponse(uC, req);
    this.sendResponse(res, response);
  }

  private buildShortenUseCase() {
    return new ShortenUseCase(Context.urlStorage, Context.urlIdGenerator);
  }

  private async getResponse(uC: ShortenUseCase, req) {
    return await uC.execute(req.body.url);
  }

  private sendResponse(res: Response, response: ShortenUseCaseResponse) {
    this.send(res, this.calculateStatus(response), this.buildBody(response));
  }

  private send(res: Response, status: number, body) {
    res.status(status);
    res.json(body);
  }

  private calculateStatus(response: ShortenUseCaseResponse) {
    return response.preexisting ? 200 : 201;
  }

  private buildBody(response: ShortenUseCaseResponse) {
    return {
      longUrl: response.longUrl,
      shortUrl: this.buildShortUrl(response.shortenedId),
    };
  }

  private buildShortUrl(shortenedId: string) {
    return `https://${process.env.DOMAIN}/${shortenedId}`;
  }
}
