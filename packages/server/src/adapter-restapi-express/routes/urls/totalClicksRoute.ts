import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
  TotalClicksUseCase,
  TotalClicksUseCaseResponse,
} from '../../../core/totalClicksUseCase';
import Context from '../../context';

export class TotalClicksRoute {
  static getHandlers(): Array<RequestHandler> {
    const tC = new TotalClicksRoute();
    return [tC.handle.bind(tC)];
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      await this.tryHandle(req, res);
    } catch (error) {
      next(error);
    }
  }

  private async tryHandle(req: Request, res: Response) {
    const uC = this.buildTotalClicksUseCase();
    const r = await this.getResponse(uC, req);
    this.sendResponse(res, r);
  }

  private buildTotalClicksUseCase() {
    return new TotalClicksUseCase(Context.urlStorage);
  }

  private async getResponse(uC: TotalClicksUseCase, req) {
    return await uC.getTotalClicksPerDay(req.params.id);
  }

  private sendResponse(res: Response, response: TotalClicksUseCaseResponse) {
    res.status(200);
    res.json({
      totalClicks: response.totalClicks,
      dailyClickCounts: response.dailyClickCounts,
    });
  }
}
