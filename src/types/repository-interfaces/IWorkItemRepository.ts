import { ClientSession, FilterQuery, UpdateWriteOpResult } from "mongoose";
import { IWorkItem } from "../entities/IWorkItem";
import { IBaseRepository } from "./IBaseRepositroy";
import { TaskCountsForEpicDto } from "../dtos/task/task.dto";

interface ITransactionOptions {
  session?: ClientSession;
}

export interface IWorkItemRepository extends IBaseRepository<IWorkItem> {
  getTasksWithAssigness(query: FilterQuery<IWorkItem>): Promise<IWorkItem[]>;
  detachByEpicId(
    epicId: string,
    options: ITransactionOptions
  ): Promise<UpdateWriteOpResult>;
  getTaskCountsForEpic(epicIds: string[]): Promise<TaskCountsForEpicDto[]>;
  count(query: FilterQuery<IWorkItem>): Promise<number>;
  updateMany(
    query: FilterQuery<IWorkItem>,
    data: Partial<IWorkItem>
  ): Promise<void>;
}
