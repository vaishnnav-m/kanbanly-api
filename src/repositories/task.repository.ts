import { injectable } from "tsyringe";
import { taskModel } from "../models/task.model";
import { ITask } from "../types/entities/ITask";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository
{
  constructor() {
    super(taskModel);
  }
}
