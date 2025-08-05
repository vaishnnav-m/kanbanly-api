import { PaginatedResponseDto } from "../dtos/paginated.dto";
import {
  WorkspaceMemberDto,
  WorkspaceMemberResponseDto,
} from "../dtos/workspaces/workspace-member.dto";
import { IWorkspaceMember } from "../entities/IWorkspaceMember";

export interface IWorkspaceMemberService {
  addMember(data: WorkspaceMemberDto): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  getMembers(
    workspaceId: string,
    userId: string,
    page: number
  ): Promise<PaginatedResponseDto<WorkspaceMemberResponseDto[]>>;
  getCurrentMember(
    workspaceId: string,
    userId: string
  ): Promise<IWorkspaceMember>;
  searchMember(
    workspaceId: string,
    userId: string,
    email: string
  ): Promise<WorkspaceMemberResponseDto>;
}
