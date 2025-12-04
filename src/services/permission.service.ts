import { inject, injectable } from "tsyringe";
import { IPermissionService } from "../types/service-interface/IPermissionService";
import { WorkspacePermission } from "../types/enums/workspace-permissions.enum";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";

@injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @inject("IWorkspaceService") private _workspaceService: IWorkspaceService,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService
  ) {}

  async hasPermission(
    userId: string,
    workspaceId: string,
    permission: WorkspacePermission
  ): Promise<boolean> {
    const member = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!member) return false;

    const workspace = await this._workspaceService.getOneWorkspace({
      userId,
      workspaceId,
    });
    if (!workspace) return false;

    const role = member.role;
    const permissions = workspace.permissions[role];

    return permissions[permission];
  }
}
