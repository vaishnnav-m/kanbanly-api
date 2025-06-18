import { IUser } from "../entities/IUser";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IUserRepository extends IBaseRepository<IUser> {
  create(user: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  updateIsVerified(email: string, status: boolean): Promise<IUser | null>;
  update(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
}
