import { injectable } from "tsyringe";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { userModel } from "../models/user.model";

@injectable()
export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    return await userModel.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await userModel.findOne({ email });
  }
}
