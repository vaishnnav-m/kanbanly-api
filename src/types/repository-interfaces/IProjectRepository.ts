import { FilterQuery } from "mongoose";
import { IProject } from "../entities/IProject";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IProjectRepository extends IBaseRepository<IProject> {
  countCreatedThisMonth(workspaceId: string): Promise<number>;
  countProjects(query?: FilterQuery<IProject>): Promise<number>;
}
