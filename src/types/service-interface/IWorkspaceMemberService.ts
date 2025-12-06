import { PaginatedResponseDto } from "../dtos/paginated.dto";
import {
  CurrentMemberResponseDto,
  EditWorkspaceMemberDto,
  WorkspaceMemberDto,
  WorkspaceMemberResponseDto,
} from "../dtos/workspaces/workspace-member.dto";

export interface IWorkspaceMemberService {
  addMember(data: WorkspaceMemberDto): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  getMembers(
    workspaceId: string,
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponseDto<WorkspaceMemberResponseDto[]>>;
  getCurrentMember(
    workspaceId: string,
    userId: string
  ): Promise<CurrentMemberResponseDto>;
  searchMember(
    workspaceId: string,
    userId: string,
    email: string
  ): Promise<WorkspaceMemberResponseDto>;
  editWorkspaceMember(
    workspaceId: string,
    userId: string,
    data: EditWorkspaceMemberDto
  ): Promise<void>;
  deleteMember(
    workspaceId: string,
    userId: string,
    memberId: string
  ): Promise<void>;
}
