import { IWorkspace } from "../entities/IWorkspace";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IWorkspaceRepository extends IBaseRepository<IWorkspace> {
  findByWorkspaceID(workspaceID: string): Promise<IWorkspace | null>;
  findAllWorkspaces(
    workspaceIds: string[],
    userId: string
  ): Promise<IWorkspace[]>;
  isOwner(workspaceId: string, userId: string): Promise<boolean>;
  findWorkspacesWithOwner(options: {
    limit?: number;
    skip?: number;
    search?: string;
  }): Promise<IWorkspace[]>;
  countWorkspaces(): Promise<number>;
}
