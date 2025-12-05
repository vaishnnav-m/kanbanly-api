export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type?: "INVITATION" | "default";
  token?: string;
  workspaceName?: string;
}

export interface NotificationResponseDto {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type?: "INVITATION" | "default";
  token?: string;
  workspaceName?: string;
  createdAt: Date;
}
