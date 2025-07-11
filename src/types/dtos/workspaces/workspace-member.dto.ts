export enum workspaceRoles {
  owner = "owner",
  projectManager = "projectManager",
  member = "member",
}

export interface WorkspaceMemberDto {
  workspaceId: string;
  userId: string;
  role: workspaceRoles;
}
