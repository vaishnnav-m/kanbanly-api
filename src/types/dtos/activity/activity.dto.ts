import { IActivity } from "../../entities/IActivity";
import { ActivityTypeEnum, TaskActivityActionEnum } from "../../enums/activity.enum";

export interface CreateActivityDto {
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  entityId: string;
  entityType: ActivityTypeEnum;
  action: TaskActivityActionEnum;
  description: string;
  oldValue?: Record<string, string | boolean>;
  newValue?: Record<string, string | boolean>;
  member: string;
}

export type ActivityResponseDto = Omit<IActivity, "member"> & {
  member: {
    userId: string;
    name: string;
    email: string;
    profile?: string;
  };
};
