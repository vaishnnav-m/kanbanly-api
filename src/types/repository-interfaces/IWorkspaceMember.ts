import { IWorkspaceMembers } from "../entities/IWorkspaceMember";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IWorkspaceMemberRepository
  extends IBaseRepository<IWorkspaceMembers> {}
