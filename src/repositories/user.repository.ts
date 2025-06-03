import { injectable } from "tsyringe";
import { IUser } from "../types/IUser";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { userModel } from "../models/user.model";

@injectable()
export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    return await userModel.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await userModel.findOne({ email });
  }

  async updateIsVerified(email: string, status: boolean): Promise<void> {
    await userModel.findOneAndUpdate({ email }, { isEmailVerified: status });
  }
}
