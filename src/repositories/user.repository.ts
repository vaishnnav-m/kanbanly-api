import { injectable } from "tsyringe";
import { IUser } from "../types/entities/IUser";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { userModel } from "../models/user.model";
import { BaseRepository } from "./base.repository";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(userModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async updateIsVerified(
    email: string,
    status: boolean
  ): Promise<IUser | null> {
    return await this.model.findOneAndUpdate(
      { email },
      { isEmailVerified: status }
    );
  }
}
