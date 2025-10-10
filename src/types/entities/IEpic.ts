import { TaskStatus } from "../dtos/task/task.dto";

export interface IEpic {
  epicId: string;
  title: string;
  normalized: string;
  status: TaskStatus;
  description?: string;
  color: string;
  projectId: string;
  workspaceId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
