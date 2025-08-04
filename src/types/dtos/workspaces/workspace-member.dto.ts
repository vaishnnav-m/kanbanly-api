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
  name: string;
  email: string;
  role: workspaceRoles;
}

// repository dto
export interface WorkspaceMemberRepoDto {
  data: {
    user: {
      email: string;
      firstName: string;
      userId:string
    };
    role: workspaceRoles;
  }[];
  count: number;
}
