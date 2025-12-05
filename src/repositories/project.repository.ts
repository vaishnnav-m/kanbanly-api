import { injectable } from "tsyringe";
import { projectModel } from "../models/project.model";
import { IProject } from "../types/entities/IProject";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

@injectable()
export class ProjectRepository
  extends BaseRepository<IProject>
  implements IProjectRepository
{
  constructor() {
    super(projectModel);
  }

  async countCreatedThisMonth(workspaceId: string): Promise<number> {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    return this.model.countDocuments({
      workspaceId,
      createdAt: { $gte: start },
    });
  }

  async countProjects(query?: FilterQuery<IProject>): Promise<number> {
    return await this.model.countDocuments(query);
  }
}
