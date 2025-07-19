import { PaginatedResponseDto } from "../dtos/paginated.dto";
import {
  WorkspaceMemberDto,
  WorkspaceMemberListDto,
} from "../dtos/workspaces/workspace-member.dto";

export interface IWorkspaceMemberService {
  addMember(data: WorkspaceMemberDto): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  getMembers(
    workspaceId: string,
    userId: string,
    page: number
  ): Promise<PaginatedResponseDto<WorkspaceMemberListDto[]>>;
}
