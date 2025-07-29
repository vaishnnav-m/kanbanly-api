export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  logo?: string;
  createdBy: string;
}

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
}
