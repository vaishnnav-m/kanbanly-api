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
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  member: string | IUser;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
