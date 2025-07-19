import { UserAdminTableDto } from "../dtos/admin/user-admin-table.dto";
import { IUser } from "../entities/IUser";

export interface IAdminService {
  getAllUsers(page:number): Promise<UserAdminTableDto>;
  updateUserStatus(userId: string): Promise<IUser | null>;
}
