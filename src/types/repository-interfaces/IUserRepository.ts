import { IUser } from "../IUser";

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  updateIsVerified(email: string, status: boolean): Promise<IUser | null>;
  update(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
}
