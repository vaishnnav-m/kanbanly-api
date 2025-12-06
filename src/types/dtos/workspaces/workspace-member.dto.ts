import { IWorkspaceMember } from "../../entities/IWorkspaceMember";
import { IWorkspacePermissions } from "./workspace.dto";

// workspace roels
export enum workspaceRoles {
  owner = "owner",
  projectManager = "projectManager",
  member = "member",
}

// request dto
export interface WorkspaceMemberDto {
  workspaceId: string;
  inviterUserId?: string;
  invitedUserId: string;
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

export type CurrentMemberResponseDto = Omit<
  WorkspaceMemberResponseDto,
  "_id" | "isActive"
> & {
  userId: string;
  permissions: IWorkspacePermissions;
};

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
