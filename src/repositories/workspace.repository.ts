import { injectable } from "tsyringe";
import { IWorkspace } from "../types/entities/IWrokspace";
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
}
