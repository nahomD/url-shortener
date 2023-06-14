import { Url } from './url';

export interface UrlStorage {
  save(shortenedUrl: Url): Promise<void>;
  findByLongUrl(longUrl: string): Promise<Url | null>;
}
