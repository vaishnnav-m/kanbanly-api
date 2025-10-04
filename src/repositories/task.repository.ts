import { injectable } from "tsyringe";
import { workItemModel } from "../models/work-item.model";
import { IWorkItem } from "../types/entities/IWorkItem";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";
import { TaskDetailRepoDto } from "../types/dtos/task/task.dto";

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
          epicId: 1,
          sprintId: 1,
        },
      },
    ]);

    return result;
  }
}
