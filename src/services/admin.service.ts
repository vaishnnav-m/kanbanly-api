import { inject, injectable } from "tsyringe";
import { IAdminService } from "../types/service-interface/IAdminService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IUser } from "../types/entities/IUser";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { UserAdminTableDto } from "../types/dtos/admin/user-admin-table.dto";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository
  ) {}

  async getAllUsers(page: number): Promise<UserAdminTableDto> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const { data: users, totalPages } =
      await this._userRepository.findWithPagination(
        {
          isAdmin: false,
        },
        { limit, skip }
      );

    const modifiedUsers = users.map(
      ({ userId, firstName, lastName, email, isActive }) => {
        return { userId, firstName, lastName, email, isActive };
      }
    );
    return { users: modifiedUsers, totalPages };
  }

  async updateUserStatus(userId: string): Promise<IUser | null> {
    const user = await this._userRepository.findOne({ userId });
    if (!user) {
      throw new AppError("cannot find user", HTTP_STATUS.BAD_REQUEST);
    }

    return await this._userRepository.update({ userId }, [
      { $set: { isActive: { $not: "$isActive" } } },
    ]);
  }
}
