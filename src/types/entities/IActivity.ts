import { ActivityTypeEnum } from "../enums/activity-type.enum";
import { IUser } from "./IUser";

export interface IActivity {
  activityId: string;
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  entityId: string;
  entityType: ActivityTypeEnum;
  action: string;
  oldValue?: Record<string, string | boolean>;
  newValue?: Record<string, string | boolean>;
  member: string | IUser;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
