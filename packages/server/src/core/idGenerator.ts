export interface IdGenerator {
  generateId(): Promise<string>;
}
