import {
  CreateNotificationDto,
  NotificationResponseDto,
} from "../dtos/notification/notification.dto";

export interface INotificationService {
  createNotification(data: CreateNotificationDto): Promise<void>;
  getNotifications(userId: string): Promise<NotificationResponseDto[]>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
}
