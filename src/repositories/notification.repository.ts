import { injectable } from "tsyringe";
import { notificationModel } from "../models/notification.model";
import { INotification } from "../types/entities/INotification";
import { INotificationRepository } from "../types/repository-interfaces/INotificationRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(notificationModel);
  }

  async updateMany(
    query: FilterQuery<INotification>,
    data: Partial<INotification>
  ): Promise<void> {
    await this.model.updateMany(query, data);
  }
}
