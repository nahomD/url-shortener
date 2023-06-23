import { Click } from '../core/click';
import DailyClickCountStat, {
  DailyClickCount,
} from '../core/dailyClickCountStat';
import { Url } from '../core/url';
import { UrlId } from '../core/urlId';
import { UrlStorage } from '../core/urlStorage';

export class FakeUrlStorage implements UrlStorage {
  private urls: Array<Url> = [];
  private clicks: Map<string, Array<Click>> = new Map();

  async saveClick(click: Click): Promise<void> {
    const cId = click.getId();
    if (this.clicks.has(cId)) this.clicks.get(cId).push(click);
    else this.clicks.set(cId, [click]);
  }

  async getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat> {
    if (this.isSaved(id)) {
      const byDay = this.groupClicksByDay(id);
      const { totalClicks, dailyClickCounts } = this.calculateStat(byDay);
      return new DailyClickCountStat(totalClicks, dailyClickCounts);
    }
    return new DailyClickCountStat(0, []);
  }

  private isSaved(id: UrlId) {
    return this.clicks.has(id.getId());
  }

  private groupClicksByDay(id: UrlId) {
    const byDay = new Map<string, Array<Click>>();
    this.clicks.get(id.getId()).forEach((c) => {
      const key = this.generateDateKey(c);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(c);
    });
    return byDay;
  }

  private generateDateKey(c: Click) {
    const d = c.getTimestamp();
    const key = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return key;
  }

  private calculateStat(byDay: Map<string, Click[]>) {
    let totalClicks = 0;
    const dailyClickCounts = [];
    byDay.forEach((v, k) => {
      totalClicks += v.length;
      dailyClickCounts.push(new DailyClickCount(k, v.length));
    });
    return { totalClicks, dailyClickCounts };
  }

  async save(shortenedUrl: Url): Promise<void> {
    this.urls.push(shortenedUrl);
  }

  async findByLongUrl(longUrl: string): Promise<Url> {
    return this.findLongUrl(longUrl);
  }

  private findLongUrl(longUrl: string) {
    return this.urls.find((e) => e.getLongUrl() === longUrl) || null;
  }

  async findById(id: string): Promise<Url> {
    return this.findId(id);
  }

  private findId(id: string): Url {
    return this.urls.find((e) => e.getShortenedId() === id) || null;
  }
}
