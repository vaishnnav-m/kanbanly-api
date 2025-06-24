import { IUser } from "../entities/IUser";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  updateIsVerified(email: string, status: boolean): Promise<IUser | null>;
}
