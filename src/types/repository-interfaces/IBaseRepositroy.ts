import { ObjectId } from "mongoose";

export interface IBaseRepository<T> {
  findOne(query: Partial<T>): Promise<T | null>;
  find(
    query?: Partial<T>,
    options?: { skip?: number; limit?: number; sort?: any }
  ): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(query: any, data: any): Promise<T | null>;
}
