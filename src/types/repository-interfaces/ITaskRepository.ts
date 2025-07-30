import { ITask } from "../entities/ITask";
import { IBaseRepository } from "./IBaseRepositroy";

export interface ITaskRepository extends IBaseRepository<ITask> {}
