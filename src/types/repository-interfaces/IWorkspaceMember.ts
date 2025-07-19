import { WorkspaceMemberRepoDto } from "../dtos/workspaces/workspace-member.dto";
import { IWorkspaceMember } from "../entities/IWorkspaceMember";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IWorkspaceMemberRepository
  extends IBaseRepository<IWorkspaceMember> {
  getMembers(
    workspaceId: string,
    skip: number,
    limit: number
  ): Promise<WorkspaceMemberRepoDto>;
}
