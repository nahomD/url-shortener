import { NextFunction, Request, RequestHandler, Response } from 'express';
import { RedirectUseCase } from '../../../core/redirectUseCase';
import Context from '../../context';

export class RedirectUrls {
  static getHandlers(): Array<RequestHandler> {
    const rU = new RedirectUrls();
    return [rU.handle.bind(rU)];
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const uC = this.buildUseCase();
      const redirectUrl = await uC.execute(req.params.id);
      this.redirect(res, redirectUrl);
    } catch (error) {
      next(error);
    }
  }

  private redirect(res: Response, redirectUrl: string) {
    res.redirect(301, redirectUrl);
  }

  private buildUseCase() {
    return new RedirectUseCase(Context.urlStorage);
  }
}
