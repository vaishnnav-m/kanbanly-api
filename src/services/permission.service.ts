import { inject, injectable } from "tsyringe";
import { IPermissionService } from "../types/service-interface/IPermissionService";
import { WorkspacePermission } from "../types/enums/workspace-permissions.enum";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";

@injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository
  ) {}

  async hasPermission(
    userId: string,
    workspaceId: string,
    permission: WorkspacePermission
  ): Promise<boolean> {
    const member = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    if (!member) return false;

    const workspace = await this._workspaceRepo.findOne({
      userId,
      workspaceId,
    });
    if (!workspace) return false;

    const role = member.role;
    const permissions = workspace.permissions[role];

    return permissions[permission];
  }
}
