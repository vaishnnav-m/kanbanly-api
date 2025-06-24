import { CreateWorkspaceDto } from "../dtos/workspace.dto";
import { IWorkspace } from "../entities/IWrokspace";

export interface IWorkspaceService {
  createWorkspace(
    workspaceData: CreateWorkspaceDto
  ): Promise<IWorkspace | null>;

  getAllWorkspaces(userid: string): Promise<IWorkspace[] | null>;

  addUserWorkspaces(
    user: {
      user: string;
      role: string;
    },
    workspaceId: string
  ): Promise<IWorkspace | null>;
}
