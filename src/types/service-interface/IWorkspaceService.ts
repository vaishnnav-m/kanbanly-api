import {
  CreateWorkspaceDto,
  GetOneWorkspaceDto,
  GetOneWorkspaceResponseDto,
} from "../dtos/workspaces/workspace.dto";
import { IWorkspace } from "../entities/IWrokspace";

export interface IWorkspaceService {
  createWorkspace(
    workspaceData: CreateWorkspaceDto
  ): Promise<IWorkspace | null>;

  getAllWorkspaces(userid: string): Promise<IWorkspace[] | null>;
  getOneWorkspace(
    workspaceData: GetOneWorkspaceDto
  ): Promise<GetOneWorkspaceResponseDto>;
}
