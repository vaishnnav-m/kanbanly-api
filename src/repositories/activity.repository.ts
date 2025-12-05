import { injectable } from "tsyringe";
import { IActivity } from "../types/entities/IActivity";
import { IActivityRepository } from "../types/repository-interfaces/IActivityRepository";
import { BaseRepository } from "./base.repository";
import { activityModel } from "../models/activity.model";
import { FilterQuery } from "mongoose";

@injectable()
export class ActivityRepository
  extends BaseRepository<IActivity>
  implements IActivityRepository
{
  constructor() {
    super(activityModel);
  }

  async getActivitiesByMember(
    query: FilterQuery<IActivity>
  ): Promise<IActivity[]> {
    const result = await this.model.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "member",
          foreignField: "userId",
          as: "member",
        },
      },
      {
        $unwind: {
          path: "$member",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return result;
  }

  async countToday(workspaceId: string): Promise<number> {
    const count = await this.model.countDocuments({
      workspaceId,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });
    return count;
  }
}
