import {
  CreateNotificationDto,
  NotificationResponseDto,
} from "../dtos/notification/notification.dto";

export interface INotificationService {
  createNotification(data: CreateNotificationDto): Promise<void>;
  getNotifications(userId: string): Promise<NotificationResponseDto[]>;
  markAsRead(notificationIds: string[], userId: string): Promise<void>;
}
