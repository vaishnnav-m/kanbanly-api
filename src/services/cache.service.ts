import { injectable } from "tsyringe";
import { config } from "../config";
import { ICacheService } from "../types/service-interface/ICacheService";
import { createClient, RedisClientType } from "redis";

@injectable()
export class CacheService implements ICacheService {
  private _client: RedisClientType;
  constructor() {
    this._client = createClient({
      username: config.redis.USER,
      password: config.redis.PASS,
      socket: {
        host: config.redis.HOST as string,
        port: Number(config.redis.PORT),
      },
    });

    this._client.on("error", (err) => {
      console.log("Redis Client Error:", err);
    });

    this.connect();
  }

  async connect(): Promise<void> {
    if (!this._client.isOpen) {
      await this._client.connect();
    }
  }

  async set(
    key: string,
    value: string,
    expiryInSeconds: number
  ): Promise<void> {
    await this._client.set(key, value, { EX: expiryInSeconds });
  }

  async get(key: string): Promise<string | null> {
    return this._client.get(key);
  }

  async del(key: string): Promise<void> {
    await this._client.del(key);
  }
}
