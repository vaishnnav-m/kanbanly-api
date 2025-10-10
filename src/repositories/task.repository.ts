import { injectable } from "tsyringe";
import { workItemModel } from "../models/work-item.model";
import { IWorkItem } from "../types/entities/IWorkItem";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import { BaseRepository } from "./base.repository";
import { ClientSession, FilterQuery, UpdateWriteOpResult } from "mongoose";
import {
  TaskCountsForEpicDto,
  TaskDetailRepoDto,
} from "../types/dtos/task/task.dto";

interface ITransactionOptions {
  session?: ClientSession;
}

@injectable()
export class WorkItemRepository
  extends BaseRepository<IWorkItem>
  implements IWorkItemRepository
{
  constructor() {
    super(workItemModel);
  }

  async getTasksWithAssigness(
    query: FilterQuery<IWorkItem>
  ): Promise<TaskDetailRepoDto[]> {
    const result = await this.model.aggregate([
      { $match: { ...query, isDeleted: false } },
      // Lookup for assignee (workspace member)
      {
        $lookup: {
          from: "workspacemembers",
          localField: "assignedTo",
          foreignField: "userId",
          as: "assignedTo",
        },
      },
      {
        $unwind: {
          path: "$assignedTo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "epics",
          localField: "epicId",
          foreignField: "epicId",
          as: "epic",
        },
      },
      {
        $unwind: {
          path: "$epic",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          taskId: 1,
          task: 1,
          description: 1,
          assignedTo: 1,
          status: 1,
          workItemType: 1,
          priority: 1,
          dueDate: 1,
          createdBy: 1,
          sprintId: 1,
          epic: {
            epicId: 1,
            title: 1,
            color: 1,
          },
        },
      },
    ]);

    return result;
  }

  async detachByEpicId(
    epicId: string,
    options: ITransactionOptions
  ): Promise<UpdateWriteOpResult> {
    return this.model
      .updateMany({ epicId }, { $set: { epicId: null } }, options)
      .exec();
  }

  async getTaskCountsForEpic(epicIds: string[]): Promise<TaskCountsForEpicDto[]> {
    const results = await this.model.aggregate([
      {
        $match: { epicId: { $in: epicIds } },
      },
      {
        $group: {
          _id: "$epicId",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: { _id: 0, epicId: "$_id", totalTasks: 1, completedTasks: 1 },
      },
    ]);
    return results;
  }
}
