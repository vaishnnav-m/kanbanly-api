import { TaskPriority, TaskStatus, WorkItemType } from "../dtos/task/task.dto";
import { IWorkspaceMember } from "./IWorkspaceMember";

export interface IWorkItem {
  taskId: string;
  task: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  workItemType: WorkItemType;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | IWorkspaceMember;
  epicId?: string;
  epic?: { epicId: string; title: string; color: string };
  parent?: string;
  sprintId?: string;
  createdBy: string | IWorkspaceMember;
  dueDate?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
