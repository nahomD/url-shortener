import { Click } from './click';
import DailyClickCountStat from './dailyClickCountStat';
import { Url } from './url';
import { UrlId } from './urlId';

export interface UrlStorage {
  save(shortenedUrl: Url): Promise<void>;
  findByLongUrl(longUrl: string): Promise<Url | null>;
  findById(id: string): Promise<Url | null>;
  getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat>;
  saveClick(click: Click): Promise<void>;
}
