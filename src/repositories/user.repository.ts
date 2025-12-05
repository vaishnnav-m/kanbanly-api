import { injectable } from "tsyringe";
import { IUser } from "../types/entities/IUser";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { userModel } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

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

  async countUsers(query?: FilterQuery<IUser>) {
    return await this.model.countDocuments(query);
  }

  async groupUsersByCreatedDate(fromDate?: Date) {
    const match: FilterQuery<IUser> = {};

    if (fromDate) {
      match.createdAt = { $gte: fromDate };
    }

    const results = await this.model.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      date: r._id,
      count: r.count,
    }));
  }
}
