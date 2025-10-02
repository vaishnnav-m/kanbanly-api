import { TaskPriority, TaskStatus, WorkItemType } from "../dtos/task/task.dto";

export interface IWorkItem {
  taskId: string;
  task: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  workItemType: WorkItemType; // Task, Bug, Feature
  status: TaskStatus; // Todo, InProgress, Completed
  priority: TaskPriority; // Low, Medium, High
  assignedTo?: string;
  epicId?: string;
  sprintId?: string;
  createdBy: string;
  dueDate?: Date;
  isDeleted: boolean;
}
