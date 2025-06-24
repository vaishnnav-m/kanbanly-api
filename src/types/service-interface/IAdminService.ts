import { IUser } from "../entities/IUser";

export interface IAdminService {
  getAllUsers(): Promise<IUser[]>;
  updateUserStatus(userId: string): Promise<IUser | null>;
}
