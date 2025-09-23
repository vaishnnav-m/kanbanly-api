import { PaginatedResponseDto } from "../dtos/paginated.dto";
import {
  EditWorkspaceMemberDto,
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
    page: number,
    search?: string
  ): Promise<PaginatedResponseDto<WorkspaceMemberResponseDto[]>>;
  getCurrentMember(
    workspaceId: string,
    userId: string
  ): Promise<Omit<IWorkspaceMember, "isActive">>;
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
