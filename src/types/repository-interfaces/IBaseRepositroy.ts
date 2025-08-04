import { ObjectId } from "mongoose";

export interface IBaseRepository<T> {
  findOne(query: Partial<T>): Promise<T | null>;
  find(
    query?: Partial<T>,
    options?: { skip?: number; limit?: number; sort?: any }
  ): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(query: any, data: any): Promise<T | null>;
  findWithPagination(
    query: Partial<T>,
    options: { skip?: number; limit?: number; sort?: any }
  ): Promise<{ data: T[]; totalPages: number }>;
  delete(query: Partial<T>): Promise<void>;
  deleteMany(query: Partial<T>): Promise<void>;
}
