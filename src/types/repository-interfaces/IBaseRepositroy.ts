import { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
  findOne(query: FilterQuery<T>): Promise<T | null>;
  find(
    query?: FilterQuery<T>,
    options?: { skip?: number; limit?: number; sort?: any }
  ): Promise<T[]>;
  create(data: FilterQuery<T>): Promise<T>;
  update(query: any, data: any): Promise<T | null>;
  findWithPagination(
    query: FilterQuery<T>,
    options: { skip?: number; limit?: number; sort?: any }
  ): Promise<{ data: T[]; totalPages: number }>;
  delete(query: FilterQuery<T>): Promise<void>;
  deleteMany(query: FilterQuery<T>): Promise<void>;
}
