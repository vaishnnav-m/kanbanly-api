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
}
