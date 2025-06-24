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

  async pushMember(
    workspaceId: string,
    member: { user: string; role: string }
  ): Promise<IWorkspace | null> {
    return this.model.findByIdAndUpdate(
      workspaceId,
      {
        $push: { members: member },
      },
      { new: true }
    );
  }
}
