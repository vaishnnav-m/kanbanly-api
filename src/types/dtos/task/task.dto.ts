import { IWorkItem } from "../../entities/IWorkItem";
import { IWorkspaceMember } from "../../entities/IWorkspaceMember";

export enum WorkItemType {
  Task = "task",
  Bug = "bug",
  Story = "story",
  Feature = "feature",
  Epic = "epic",
  Subtask = "subtask",
}

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
  workItemType: WorkItemType;
  status?: TaskStatus;
  epicId?: string;
  sprintId?: string;
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
  parent?: {
    parentId: string;
    title: string;
    type: WorkItemType;
    color: string;
  };
  dueDate?: Date;
}

export type TaskDetailRepoDto = Omit<IWorkItem, "assignedTo"> & {
  assignedTo: IWorkspaceMember;
};

export interface TaskListingDto {
  taskId: string;
  task: string;
  description?: string;
  status: TaskStatus;
  assignedTo: {
    email: string;
    name: string;
  } | null;
  priority: TaskPriority;
  dueDate?: Date;
}

export interface TaskCountsForEpicDto {
  epicId: string;
  totalTasks: number;
  completedTasks: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  workItemType?: WorkItemType;
}
