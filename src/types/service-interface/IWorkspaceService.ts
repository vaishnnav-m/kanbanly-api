import { CreateWorkspaceDto } from "../dtos/workspace.dto";
import { IWorkspace } from "../entities/IWrokspace";

export interface IWorkspaceService {
  createWorkspace(
    workspaceData: CreateWorkspaceDto
  ): Promise<IWorkspace | null>;
}
