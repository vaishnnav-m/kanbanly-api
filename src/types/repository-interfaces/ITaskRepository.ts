import { FilterQuery } from "mongoose";
import { ITask } from "../entities/ITask";
import { IBaseRepository } from "./IBaseRepositroy";
import { TaskDetailRepoDto } from "../dtos/task/task.dto";

export interface ITaskRepository extends IBaseRepository<ITask> {
  getTasksWithAssigness(query: FilterQuery<ITask>): Promise<TaskDetailRepoDto>;
}
