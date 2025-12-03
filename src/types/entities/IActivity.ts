import { ActivityTypeEnum, TaskActivityActionEnum } from "../enums/activity.enum";
import { IUser } from "./IUser";

export interface IActivity {
  activityId: string;
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  entityId: string;
  entityType: ActivityTypeEnum;
  action: TaskActivityActionEnum;
  oldValue?: Record<string, string | boolean>;
  newValue?: Record<string, string | boolean>;
  member: string | IUser;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
