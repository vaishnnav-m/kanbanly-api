export interface INotification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type?: "INVITATION" | "default";
  token?: string;
  workspaceName?: string;
  createdAt: Date;
  updatedAt: Date;
}
