export interface ShortenerService {
  generateShortenedId(longUrl: string): string;
}
