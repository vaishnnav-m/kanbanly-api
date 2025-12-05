import { injectable } from "tsyringe";
import { subscriptionModel } from "../models/subscription.model";
import { ISubscription } from "../types/entities/ISubscription";
import { ISubscriptionRepository } from "../types/repository-interfaces/ISubscriptionRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor() {
    super(subscriptionModel);
  }
  async upsert(
    query: FilterQuery<ISubscription>,
    data: Partial<ISubscription>
  ): Promise<void> {
    this.model.updateOne(query, data, { upsert: true });
  }

  async countSubscriptions(
    query?: FilterQuery<ISubscription>
  ): Promise<number> {
    return this.model.countDocuments(query);
  }

  async groupSubscriptionsByCreatedDate(fromDate?: Date) {
    const match: FilterQuery<ISubscription> = {};

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

  async groupActiveSubscriptionsByPlan() {
    const results = await this.model.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "planId",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
      {
        $group: {
          _id: "$plan.name",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      planName: r._id,
      count: r.count,
    }));
  }
}
