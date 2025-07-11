import { Model } from "mongoose";
import { IBaseRepository } from "../types/repository-interfaces/IBaseRepositroy";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findOne(query: Partial<T>): Promise<T | null> {
    return this.model.findOne(query);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async find(
    query: Partial<T>,
    options: { skip?: number; limit?: number; sort?: any } = {}
  ): Promise<T[]> {
    let q = this.model.find(query);

    if (options.skip) {
      q.skip(options.skip);
    }

    if (options.limit) {
      q.limit(options.limit);
    }

    if (options.sort) {
      q.sort(options.sort);
    } else {
      q.sort({ createdAt: -1 });
    }

    return q.exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(query: any, data: any): Promise<T | null> {
    return this.model.findOneAndUpdate(query, data);
  }
}
