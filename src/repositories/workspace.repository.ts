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

  async findWorkspacesWithOwner(options: {
    limit?: number;
    skip?: number;
    search?: string;
  }): Promise<IWorkspace[]> {
    const { limit = 10, skip = 0, search = "" } = options;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    console.log("search query", query,skip,limit);
    const result = await this.model.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "userId",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
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
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return result;
  }

  async countWorkspaces(): Promise<number> {
    return await this.model.countDocuments();
  }
}
