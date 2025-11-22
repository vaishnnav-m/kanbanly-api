import {
  CreateWorkspaceDto,
  EditWorkspaceDto,
  GetOneWorkspaceDto,
  GetOneWorkspaceResponseDto,
  WorkspaceListResponseDto,
} from "../dtos/workspaces/workspace.dto";

export interface IWorkspaceService {
  createWorkspace(workspaceData: CreateWorkspaceDto): Promise<void>;
  getAllWorkspaces(
    userid: string,
    role: string
  ): Promise<WorkspaceListResponseDto[] | null>;
  getOneWorkspace(
    workspaceData: GetOneWorkspaceDto
  ): Promise<GetOneWorkspaceResponseDto>;
  editWorkspace(data: EditWorkspaceDto): Promise<void>;
  removeWorkspace(
    workspaceId: string,
    userId: string,
    role: string
  ): Promise<void>;
}
