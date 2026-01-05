import { WorkspacePermission } from "../../enums/workspace-permissions.enum";

export type IWorkspacePermissions = {
  [key in WorkspacePermission]: boolean;
};

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  logo?: string;
  createdBy: string;
}

export type WorkspaceListResponseDto = {
  workspaces: {
    workspaceId: string;
    name: string;
    description?: string;
    createdBy?: {
      userId: string;
      email: string;
      name: string;
      profile?: string;
    };
    memberCount?: number;
    logo?: string;
    slug: string;
  }[];
  totalPages?: number;
};

export interface GetOneWorkspaceDto {
  workspaceId: string;
  userId: string;
}

export interface GetOneWorkspaceResponseDto {
  name: string;
  description: string;
  logo: string;
  createdAt: Date;
  members: number;
  permissions: {
    owner: IWorkspacePermissions;
    projectManager: IWorkspacePermissions;
    member: IWorkspacePermissions;
  };
}

export type EditWorkspaceDto = Partial<CreateWorkspaceDto> & {
  workspaceId: string;
  createdBy: string;
};
