export interface ICacheService {
  connect(): Promise<void>;
  set(key: string, value: string, expiryInSeconds: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
}
