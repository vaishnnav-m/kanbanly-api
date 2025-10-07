import { FilterQuery, UpdateWriteOpResult } from "mongoose";
import { IWorkItem } from "../entities/IWorkItem";
import { IBaseRepository } from "./IBaseRepositroy";
import { TaskDetailRepoDto } from "../dtos/task/task.dto";

export interface IWorkItemRepository extends IBaseRepository<IWorkItem> {
  getTasksWithAssigness(
    query: FilterQuery<IWorkItem>
  ): Promise<TaskDetailRepoDto[]>;
  detachByEpicId(epicId: string, options: any): Promise<UpdateWriteOpResult>;
}
