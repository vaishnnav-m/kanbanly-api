export interface INotification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
