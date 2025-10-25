import { workspaceRoles } from "../dtos/workspaces/workspace-member.dto";

export interface IWorkspaceMember {
  workspaceId: string;
  userId: string;
  email: string;
  name: string;
  profile?: string;
  role: workspaceRoles;
  createdAt: Date;
  isActive: boolean;
}
