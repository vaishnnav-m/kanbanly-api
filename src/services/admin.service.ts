import { inject, injectable } from "tsyringe";
import { IAdminService } from "../types/service-interface/IAdminService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IUser } from "../types/entities/IUser";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository
  ) {}

  async getAllUsers(): Promise<IUser[]> {
    return this._userRepository.find({ isAdmin: false });
  }

  async updateUserStatus(userId: string): Promise<IUser | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError("cannot find user", HTTP_STATUS.BAD_REQUEST);
    }
    
    return await this._userRepository.update(userId, [
      { $set: { isActive: { $not: "$isActive" } } },
    ]);
  }
}
