export interface IBaseRepository<T> {
  findOne(query: any): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: any): Promise<T | null>;
}
