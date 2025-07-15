import { IWorkspace } from "../entities/IWrokspace";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IWorkspaceRepository extends IBaseRepository<IWorkspace> {
  findByWorkspaceID(workspaceID: string): Promise<IWorkspace | null>;
}
