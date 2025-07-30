import { ITask } from "../../entities/ITask";

export enum TaskStatus {
  Todo = "todo",
  InProgress = "inprogress",
  Completed = "completed",
}

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export interface CreateTaskDto {
  task: string;
  description?: string;
  projectId: string;
  workspaceId: string;
  priority: TaskPriority;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
} 
