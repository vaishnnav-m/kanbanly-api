import { FilterQuery } from "mongoose";
import { ISubscription } from "../entities/ISubscription";
import { IBaseRepository } from "./IBaseRepositroy";

export interface ISubscriptionRepository
  extends IBaseRepository<ISubscription> {
  upsert(
    query: FilterQuery<ISubscription>,
    data: Partial<ISubscription>
  ): Promise<void>;
  countSubscriptions(query?: FilterQuery<ISubscription>): Promise<number>;
  groupSubscriptionsByCreatedDate(
    fromDate?: Date
  ): Promise<{ date: string; count: number }[]>;
  groupActiveSubscriptionsByPlan(
    fromDate?: Date
  ): Promise<{ planName: string; count: number }[]>;
}
