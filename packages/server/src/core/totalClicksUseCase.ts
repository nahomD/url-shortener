import DailyClickCountStat, { DailyClickCount } from './dailyClickCountStat';
import { UrlId } from './urlId';
import { UrlStorage } from './urlStorage';
import { ValidationError } from './validationError';
import { ValidationMessages } from './validationMessages';

export class TotalClicksUseCase {
  constructor(private urlStorage: UrlStorage) {}

  async getTotalClicksPerDay(id: string): Promise<TotalClicksUseCaseResponse> {
    const uId = this.buildUrlId(id);
    await this.checkIfUrlWasSaved(uId);
    const stat = await this.getDailyClickCountStat(uId);
    return this.buildResponse(stat);
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private async checkIfUrlWasSaved(uId: UrlId) {
    const url = await this.urlStorage.findById(uId.getId());
    if (!url) throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }

  private async getDailyClickCountStat(uId: UrlId) {
    return await this.urlStorage.getTotalClicksByDay(uId);
  }

  private buildResponse(stat: DailyClickCountStat): TotalClicksUseCaseResponse {
    return {
      totalClicks: stat.getTotalClicks(),
      dailyClickCounts: stat.getDailyClickCounts(),
    };
  }
}

export interface TotalClicksUseCaseResponse {
  totalClicks: number;
  dailyClickCounts: Array<DailyClickCount>;
}
