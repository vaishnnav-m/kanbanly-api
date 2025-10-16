import { FilterQuery, UpdateWriteOpResult } from "mongoose";
import { IWorkItem } from "../entities/IWorkItem";
import { IBaseRepository } from "./IBaseRepositroy";
import { TaskCountsForEpicDto, TaskDetailRepoDto } from "../dtos/task/task.dto";

export interface IWorkItemRepository extends IBaseRepository<IWorkItem> {
  getTasksWithAssigness(
    query: FilterQuery<IWorkItem>
  ): Promise<TaskDetailRepoDto[]>;
  detachByEpicId(epicId: string, options: any): Promise<UpdateWriteOpResult>;
  getTaskCountsForEpic(epicIds: string[]): Promise<TaskCountsForEpicDto[]>;
  count(query: FilterQuery<IWorkItem>): Promise<number>;
  updateMany(query: FilterQuery<IWorkItem>, data: any): Promise<void>;
}
