import { UserAdminTableDto } from "../dtos/admin/user-admin-table.dto";

export interface IAdminService {
  getAllUsers(page: number, search: string): Promise<UserAdminTableDto>;
  updateUserStatus(userId: string): Promise<void>;
}
