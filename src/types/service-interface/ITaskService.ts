import { CreateTaskDto } from "../dtos/task/task.dto";

export interface ITaskService {
  createTask(data: CreateTaskDto): Promise<void>;
}
