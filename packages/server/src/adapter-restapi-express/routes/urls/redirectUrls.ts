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
      await this.tryHandle(req, res);
    } catch (error) {
      next(error);
    }
  }

  private async tryHandle(req: Request, res: Response) {
    const uC = this.buildUseCase();
    const redirectUrl = await this.executeUseCase(uC, req);
    this.redirect(res, redirectUrl);
  }

  private buildUseCase() {
    return new RedirectUseCase(Context.urlStorage);
  }

  private async executeUseCase(uC: RedirectUseCase, req): Promise<string> {
    return await uC.execute(req.params.id);
  }

  private redirect(res: Response, redirectUrl: string) {
    res.redirect(301, redirectUrl);
  }
}
