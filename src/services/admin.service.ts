import { inject, injectable } from "tsyringe";
import { IAdminService } from "../types/service-interface/IAdminService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IUser } from "../types/entities/IUser";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository
  ) {}

  async getAllUsers(): Promise<IUser[]> {
    return this._userRepository.find({ isAdmin: false });
  }
}
