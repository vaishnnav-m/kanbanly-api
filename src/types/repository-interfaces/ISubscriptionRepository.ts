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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ date: any; count: any }[]>;
  groupActiveSubscriptionsByPlan(
    fromDate?: Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ planName: any; count: any }[]>;
}
