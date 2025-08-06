import {
  CreateTaskDto,
  EditTaskDto,
  TaskDetailsDto,
  TaskStatus,
} from "../dtos/task/task.dto";
import { ITask } from "../entities/ITask";

export interface ITaskService {
  createTask(data: CreateTaskDto): Promise<void>;
  getAllTask(
    workspaceId: string,
    projectId: string,
    userId: string
  ): Promise<ITask[]>;
  getOneTask(
    workspaceId: string,
    projectId: string,
    userId: string,
    taskId: string
  ): Promise<TaskDetailsDto>;
  changeTaskStatus(
    taskId: string,
    userId: string,
    newStatus: TaskStatus
  ): Promise<void>;
  editTaskStatus(
    taskId: string,
    userId: string,
    data: EditTaskDto
  ): Promise<void>;
  removeTask(
    workspaceId: string,
    taskId: string,
    userId: string
  ): Promise<void>;
}
