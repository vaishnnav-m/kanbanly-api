import { WorkspaceMemberDto } from "../dtos/workspaces/workspace-member.dto";

export interface IWorkspaceMemberService {
  addMember(data: WorkspaceMemberDto): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
}
