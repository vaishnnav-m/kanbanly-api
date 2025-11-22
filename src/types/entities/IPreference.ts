export interface INotificationPreference {
  email: boolean;
  app: boolean;
}

export interface IPreference {
  preferenceId: string;
  userId: string;
  taskAssigned: INotificationPreference;
  taskCompleted: INotificationPreference;
  dueDateReminder: INotificationPreference;
  mention: INotificationPreference;
  sprint: INotificationPreference;
  invitation: INotificationPreference;
  createdAt: Date;
  updatedAt: Date;
}
