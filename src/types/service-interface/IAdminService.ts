import { IUser } from "../entities/IUser";

export interface IAdminService {
  getAllUsers(): Promise<IUser[]>;
}
