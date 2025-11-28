export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
}

export interface NotificationResponseDto {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  createdAt: Date;
}
