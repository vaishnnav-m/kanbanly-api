import { WorkspacePermission } from "../enums/workspace-permissions.enum";

export interface IPermissionService {
  hasPermission(
    userId: string,
    workspaceId: string,
    permission: WorkspacePermission
  ): Promise<boolean>;
}
