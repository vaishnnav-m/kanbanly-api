export interface INotificationPreference {
  email: boolean;
  app: boolean;
}

export interface IPreference {
  preferenceId: string;
  userId: string;
  taskAssigned: INotificationPreference;
  mention: INotificationPreference;
  dueDateReminder: INotificationPreference;
  createdAt: Date;
  updatedAt: Date;
}
