import { Url } from './url';

export interface UrlStorage {
  save(shortenedUrl: Url): Promise<void>;
  find(longUrl: string): Promise<Url | null>;
}
