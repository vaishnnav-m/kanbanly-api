import { workspaceRoles } from "../dtos/workspaces/workspace-member.dto";
import {
  CreateWorkspaceDto,
  EditWorkspaceDto,
  GetOneWorkspaceDto,
  GetOneWorkspaceResponseDto,
  IWorkspacePermissions,
  WorkspaceListResponseDto,
} from "../dtos/workspaces/workspace.dto";

export interface IWorkspaceService {
  createWorkspace(workspaceData: CreateWorkspaceDto): Promise<void>;

  getAllWorkspaces(
    userid: string,
    role: string,
    search?: string,
    page?: number
  ): Promise<WorkspaceListResponseDto | null>;

  getOneWorkspace(
    workspaceData: GetOneWorkspaceDto
  ): Promise<GetOneWorkspaceResponseDto>;

  editWorkspace(data: EditWorkspaceDto): Promise<void>;

  updateRolePermissions(
    workspaceId: string,
    role: workspaceRoles,
    newPermissions: Partial<IWorkspacePermissions>,
    userId: string
  ): Promise<void>;

  removeWorkspace(
    workspaceId: string,
    userId: string,
    role: string
  ): Promise<void>;
}
