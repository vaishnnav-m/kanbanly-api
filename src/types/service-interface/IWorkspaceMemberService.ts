import { WorkspaceMemberDto } from "../dtos/workspaces/workspace-member.dto";
import { IWorkspaceMember } from "../entities/IWorkspaceMember";

export interface IWorkspaceMemberService {
  addMember(data: WorkspaceMemberDto): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  // getMembers(workspaceId: string, userId: string): Promise<IWorkspaceMember[]>;
}
