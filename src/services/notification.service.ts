import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { INotificationService } from "../types/service-interface/INotificationService";
import { INotificationRepository } from "../types/repository-interfaces/INotificationRepository";
import {
  CreateNotificationDto,
  NotificationResponseDto,
} from "../types/dtos/notification/notification.dto";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import {
  NotificationEvent,
  notificationEvents,
} from "../events/notification.events";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject("INotificationRepository")
    private _notificationRepo: INotificationRepository
  ) {}

  async createNotification(data: CreateNotificationDto): Promise<void> {
    const newNotification = {
      notificationId: uuidv4(),
      userId: data.userId,
      title: data.title,
      message: data.message,
    };

    await this._notificationRepo.create(newNotification);

    notificationEvents.emit(NotificationEvent.Notification, newNotification);
  }

  async getNotifications(userId: string): Promise<NotificationResponseDto[]> {
    const notifications = await this._notificationRepo.find({
      userId,
      read: false,
    });

    const mappedNotifications = notifications.map((notification) => ({
      notificationId: notification.notificationId,
      userId,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
    }));

    return mappedNotifications;
  }

  async markAsRead(notificationIds: string[], userId: string): Promise<void> {
    const notifications = await this._notificationRepo.find({
      notificationId: { $in: notificationIds },
      userId,
    });

    if (notifications.length !== notificationIds.length) {
      throw new AppError(
        ERROR_MESSAGES.NOTIFICATION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._notificationRepo.updateMany(
      { notificationId: { $in: notificationIds }, userId },
      { read: true }
    );
  }
}
