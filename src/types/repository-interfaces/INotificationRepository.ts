import { FilterQuery } from "mongoose";
import { INotification } from "../entities/INotification";
import { IBaseRepository } from "./IBaseRepositroy";

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  updateMany(
    query: FilterQuery<INotification>,
    data: Partial<INotification>
  ): Promise<void>;
}
