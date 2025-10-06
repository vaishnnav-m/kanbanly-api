import { TaskPriority, TaskStatus, WorkItemType } from "../dtos/task/task.dto";

export interface IWorkItem {
  taskId: string;
  task: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  workItemType: WorkItemType; // Task, Bug, Feature, Story
  status: TaskStatus; // Todo, InProgress, Completed
  priority: TaskPriority; // Low, Medium, High
  assignedTo?: string;
  epicId?: string;
  epic?: { epicId: string; title: string; color: string };
  sprintId?: string;
  createdBy: string;
  dueDate?: Date;
  isDeleted: boolean;
}
