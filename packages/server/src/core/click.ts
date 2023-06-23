import { UrlId } from './urlId';

export class Click {
  constructor(private id: UrlId, private timestamp: Date) {}

  getId() {
    return this.id.getId();
  }

  getTimestamp() {
    return this.timestamp;
  }
}
