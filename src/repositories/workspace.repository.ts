import { injectable } from "tsyringe";
import { IWorkspace } from "../types/entities/IWorkspace";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { BaseRepository } from "./base.repository";
import { workspaceModel } from "../models/workspace.model";

@injectable()
export class WorkspaceRepository
  extends BaseRepository<IWorkspace>
  implements IWorkspaceRepository
{
  constructor() {
    super(workspaceModel);
  }

  async findByWorkspaceID(workspaceId: string): Promise<IWorkspace | null> {
    return this.model.findOne({ workspaceId });
  }

  async findAllWorkspaces(
    workspaceIds: string[],
    userId: string
  ): Promise<IWorkspace[]> {
    return this.model.find({
      $or: [{ createdBy: userId }, { workspaceId: { $in: workspaceIds } }],
    });
  }

  async isOwner(workspaceId: string, userId: string): Promise<boolean> {
    const onwner = await this.model
      .findOne({ workspaceId })
      .select("createdBy");
    return userId === onwner?.createdBy;
  }

  async findWorkspacesWithOwner(): Promise<IWorkspace[]> {
    const result = this.model.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "userId",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $lookup: {
          from: "workspacemembers",
          localField: "workspaceId",
          foreignField: "workspaceId",
          as: "members",
        },
      },
      {
        $addFields: {
          memberCount: { $size: "$members" },
        },
      },
      {
        $project: {
          _id: 1,
          workspaceId: 1,
          name: 1,
          description: 1,
          memberCount: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: 1,
        },
      },
    ]);

    return result;
  }
}
