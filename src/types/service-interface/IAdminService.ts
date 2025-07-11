import { UserAdminTableDto } from "../dtos/users/user-admin-table.dto";
import { IUser } from "../entities/IUser";

export interface IAdminService {
  getAllUsers(): Promise<UserAdminTableDto[]>;
  updateUserStatus(userId: string): Promise<IUser | null>;
}
