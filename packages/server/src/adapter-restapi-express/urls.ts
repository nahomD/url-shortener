import express, { Request, Response } from 'express';
import { ShortenUseCase, ShortenUseCaseResponse } from '../core/shortenUseCase';
import Context from './context';
import { ValidationError } from '../core/validationError';

const router = express.Router();

class PostUrl {
  async handle(req: Request, res: Response) {
    try {
      await this.tryHandle(req, res);
    } catch (error) {
      if (this.isValidationError(error)) {
        this.sendBadRequestWithValidationMessage(res, error);
      } else {
        this.sendInternalSeverError(res);
      }
    }
  }

  private async tryHandle(req: Request, res: Response) {
    const uC = this.buildShortenUseCase();
    const result = await uC.execute(req.body.url);
    this.sendResponse(res, result);
  }

  private buildShortenUseCase() {
    return new ShortenUseCase(Context.urlStorage, Context.idGenerator);
  }

  private sendResponse(res: Response, result: ShortenUseCaseResponse) {
    const status = result.preexisting ? 200 : 201;
    res.status(status);
    res.json(this.buildResponse(result));
  }

  private buildResponse(result: ShortenUseCaseResponse) {
    return {
      longUrl: result.longUrl,
      shortUrl: this.buildShortUrl(result.shortenedId),
    };
  }

  private buildShortUrl(shortenedId: string) {
    return `https://${process.env.HOST}/${shortenedId}`;
  }

  private isValidationError(error: unknown) {
    return error instanceof ValidationError;
  }

  private sendBadRequestWithValidationMessage(
    res: Response,
    error: ValidationError
  ) {
    res.status(400);
    res.json({ message: error.message });
  }

  private sendInternalSeverError(res: Response) {
    res.status(500);
    res.json({ message: 'Server Error' });
  }
}

const postUrl = new PostUrl();
router.post('/urls', postUrl.handle.bind(postUrl));

export default router;
