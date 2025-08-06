import { injectable } from "tsyringe";
import { taskModel } from "../models/task.model";
import { ITask } from "../types/entities/ITask";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";
import { TaskDetailRepoDto } from "../types/dtos/task/task.dto";

@injectable()
export class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository
{
  constructor() {
    super(taskModel);
  }

  async getTasksWithAssigness(
    query: FilterQuery<ITask>
  ): Promise<TaskDetailRepoDto> {
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
          priority: 1,
          dueDate: 1,
          createdBy: 1,
        },
      },
    ]);

    const data = result[0];

    return data;
  }
}
