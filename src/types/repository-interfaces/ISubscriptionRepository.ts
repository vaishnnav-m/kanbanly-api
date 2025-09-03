import { ISubscription } from "../entities/ISubscription";
import { IBaseRepository } from "./IBaseRepositroy";

export interface ISubscriptionRepository
  extends IBaseRepository<ISubscription> {}
