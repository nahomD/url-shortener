export class Url {
  constructor(private longUrl: string, private shortenedId: string) {}
  getLongUrl() {
    return this.longUrl;
  }

  getShortenedId() {
    return this.shortenedId;
  }
}
