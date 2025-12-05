import { IWorkspacePermissions } from "../dtos/workspaces/workspace.dto";
import { IUser } from "./IUser";

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
  createdBy: string | IUser;
  memberCount?: number;
  createdAt: Date;
}
