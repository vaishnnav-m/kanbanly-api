import { IWorkspace } from "../../entities/IWrokspace";

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  logo?: string;
  createdBy: string;
}

export type WorkspaceListResponseDto = Omit<
  IWorkspace,
  "createdAt" | "createdBy"
>;
// & { members: number };

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

export type EditWorkspaceDto = Partial<CreateWorkspaceDto> & {
  workspaceId: string;
};
