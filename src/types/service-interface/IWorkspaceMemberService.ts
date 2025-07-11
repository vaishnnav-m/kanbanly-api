import { WorkspaceMemberDto } from "../dtos/workspaces/workspace-member.dto";
import { IWorkspaceMember } from "../entities/IWorkspaceMember";

export interface IWorkspaceMemberService {
  addMember(data: WorkspaceMemberDto): Promise<void>;
}
