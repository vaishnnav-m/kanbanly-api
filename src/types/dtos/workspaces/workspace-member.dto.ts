import { IWorkspaceMember } from "../../entities/IWorkspaceMember";

// workspace roels
export enum workspaceRoles {
  owner = "owner",
  projectManager = "projectManager",
  member = "member",
}

// request dto
export interface WorkspaceMemberDto {
  workspaceId: string;
  userId: string;
  role: workspaceRoles;
}

// response dto
export interface WorkspaceMemberResponseDto {
  _id?: string;
  name: string;
  email: string;
  profile?: string;
  role: workspaceRoles;
  isActive: boolean;
}

// repository dto
export interface WorkspaceMemberRepoDto {
  data: IWorkspaceMember[];
  count: number;
}

export interface EditWorkspaceMemberDto {
  memberId: string;
  role?: workspaceRoles;
  isActive?: boolean;
}
