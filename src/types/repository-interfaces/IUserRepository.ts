import { FilterQuery } from "mongoose";
import { IUser } from "../entities/IUser";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  updateIsVerified(email: string, status: boolean): Promise<IUser | null>;
  countUsers(query?: FilterQuery<IUser>): Promise<number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupUsersByCreatedDate(fromDate?: Date): Promise<{ count: any; date: any }[]>;
}
