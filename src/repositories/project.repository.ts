import { injectable } from "tsyringe";
import { projectModel } from "../models/project.model";
import { IProject } from "../types/entities/IProject";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { BaseRepository } from "./base.repository";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";

@injectable()
export class ProjectRepository
  extends BaseRepository<IProject>
  implements IProjectRepository
{
  constructor() {
    super(projectModel);
  }

  // async getProjectByUsers(
  //   workspaceId: string,
  //   projectId: string
  // ): Promise<Omit<IProject, "members"> & { members: IWorkspaceMember[] }> {
  //   const result = await this.model.aggregate([
  //     { $match: { workspaceId, projectId } },
  //     {
  //       $lookup: {
  //         from: "workspaceMembers",
  //         localField: "members",
  //         foreignField: "userId",
  //         as: "members",
  //       },
  //     },
  //   ]);

  //   return result;
  // }
}
