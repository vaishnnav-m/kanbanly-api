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
    options: { skip?: number; limit?: number; sort?: any }
  ): Promise<T[]> {
    return this.model.find(query, options).sort({ createdAt: 1 });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }
}
