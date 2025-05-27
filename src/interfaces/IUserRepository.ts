import { IUser } from "./IUser";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
}
