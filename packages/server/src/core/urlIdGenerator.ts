import { UrlId } from './urlId';

export interface UrlIdGenerator {
  generateUrlId(): Promise<UrlId>;
}
