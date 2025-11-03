import { FilterQuery, SortOrder } from "mongoose";

export interface IBaseRepository<T> {
  findOne(query: FilterQuery<T>): Promise<T | null>;
  find(
    query?: FilterQuery<T>,
    options?: {
      skip?: number;
      limit?: number;
      sort?: Record<string, SortOrder>;
    }
  ): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(query: FilterQuery<T>, data: FilterQuery<T>): Promise<T | null>;
  findWithPagination(
    query: FilterQuery<T>,
    options: { skip?: number; limit?: number; sort?: Record<string, SortOrder> }
  ): Promise<{ data: T[]; totalPages: number }>;
  delete(query: FilterQuery<T>): Promise<void>;
  deleteMany(query: FilterQuery<T>): Promise<void>;
}
