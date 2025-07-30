import { TaskPriority, TaskStatus } from "../dtos/task/task.dto";

export interface ITask {
  taskId: string;
  task: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  createdBy: string;
  dueDate?: Date;
  isDeleted: false;
}
