import {
  CreateTaskDto,
  EditTaskDto,
  TaskDetailsDto,
  TaskListingDto,
  TaskStatus,
} from "../dtos/task/task.dto";

export interface ITaskService {
  createTask(data: CreateTaskDto): Promise<void>;
  getAllTask(
    workspaceId: string,
    projectId: string,
    userId: string
  ): Promise<TaskListingDto[]>;
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
  editTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    data: EditTaskDto
  ): Promise<void>;
  attachParentItem(
    parentType: "task" | "epic",
    parentId: string,
    taskId: string,
    workspaceId: string,
    userId: string
  ): Promise<void>;
  removeTask(
    workspaceId: string,
    taskId: string,
    userId: string
  ): Promise<void>;
}
