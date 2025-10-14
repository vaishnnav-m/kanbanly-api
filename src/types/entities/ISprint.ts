import { SprintStatus } from "../dtos/sprint/sprint.dto";

export interface ISprint {
  sprintId: string;
  name: string;
  normalizedName: string;
  goal?: string;
  status: SprintStatus;
  workspaceId: string;
  projectId: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
}
