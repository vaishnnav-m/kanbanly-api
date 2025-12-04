import { IWorkspacePermissions } from "../dtos/workspaces/workspace.dto";

export interface IWorkspace {
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  permissions: {
    owner: IWorkspacePermissions;
    projectManager: IWorkspacePermissions;
    member: IWorkspacePermissions;
  };
  createdBy: string;
  createdAt: Date;
}
