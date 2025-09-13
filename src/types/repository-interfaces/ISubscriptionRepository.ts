import { FilterQuery } from "mongoose";
import { ISubscription } from "../entities/ISubscription";
import { IBaseRepository } from "./IBaseRepositroy";

export interface ISubscriptionRepository
  extends IBaseRepository<ISubscription> {
  upsert(
    query: FilterQuery<ISubscription>,
    data: Partial<ISubscription>
  ): Promise<void>;
}
