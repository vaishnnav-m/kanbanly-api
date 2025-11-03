import { FilterQuery, Model, SortOrder } from "mongoose";
import { IBaseRepository } from "../types/repository-interfaces/IBaseRepositroy";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query, { _id: 0, __v: 0 });
  }

  async find(
    query: FilterQuery<T>,
    options: {
      skip?: number;
      limit?: number;
      sort?: Record<string, SortOrder>;
    } = {}
  ): Promise<T[]> {
    const q = this.model.find(query, { _id: 0, __v: 0 });

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

  async create(data: FilterQuery<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(query: FilterQuery<T>, data: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(query, data);
  }

  async findWithPagination(
    query: FilterQuery<T>,
    options: { skip?: number; limit?: number; sort?: Record<string, SortOrder> }
  ): Promise<{ data: T[]; totalPages: number }> {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    const [data, total] = await Promise.all([
      this.model
        .find(query, { _id: 0, __v: 0 })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec(),
      this.model.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { data, totalPages };
  }

  async delete(query: FilterQuery<T>): Promise<void> {
    await this.model.deleteOne(query);
  }

  async deleteMany(query: FilterQuery<T>): Promise<void> {
    await this.model.deleteMany(query);
  }
}
