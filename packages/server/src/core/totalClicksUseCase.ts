import { DailyClickCount } from './dailyClickCountStat';
import { UrlId } from './urlId';
import { UrlStorage } from './urlStorage';

export class TotalClicksUseCase {
  constructor(private storage: UrlStorage) {}

  async getTotalClicksPerDay(id: string): Promise<TotalClicksUseCaseResponse> {
    const uId = new UrlId(id);
    const stat = await this.storage.getTotalClicksByDay(uId);
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
