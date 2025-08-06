import { ITask } from "../../entities/ITask";
import { IWorkspaceMember } from "../../entities/IWorkspaceMember";

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

export interface EditTaskDto {
  taskId: string;
  userId: string;
  task?: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
}

export interface TaskDetailsDto {
  taskId: string;
  task: string;
  description?: string;
  status: string;
  assignedTo: {
    email: string;
    name: string;
  } | null;
  priority: TaskPriority;
  dueDate?: Date;
}

export type TaskDetailRepoDto = Omit<ITask, "assignedTo"> & {
  assignedTo: IWorkspaceMember;
};
