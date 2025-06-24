import { IWorkspace } from "../entities/IWrokspace";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IWorkspaceRepository extends IBaseRepository<IWorkspace> {
  pushMember(
    workspaceId: string,
    member: { user: string; role: string }
  ): Promise<IWorkspace | null>;
}
