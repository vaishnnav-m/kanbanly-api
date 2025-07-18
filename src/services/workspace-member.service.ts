import { inject, injectable } from "tsyringe";
import {
  WorkspaceMemberDto,
  WorkspaceMemberListDto,
  workspaceRoles,
} from "../types/dtos/workspaces/workspace-member.dto";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { PaginatedResponseDto } from "../types/dtos/paginated.dto";
import { ERROR_MESSAGES } from "../shared/constants/messages";

@injectable()
export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IWorkspaceRepository") private _workspaceRepo: IWorkspaceRepository
  ) {}

  async addMember(data: WorkspaceMemberDto): Promise<void> {
    if (!Object.values(workspaceRoles).includes(data.role)) {
      throw new AppError("invalid role", HTTP_STATUS.BAD_REQUEST);
    }

    const workspace = await this._workspaceRepo.findOne({
      workspaceId: data.workspaceId,
    });
    if (!workspace) {
      throw new AppError("workspace not found", HTTP_STATUS.BAD_REQUEST);
    }

    const existingMember = await this._workspaceMemberRepo.findOne({
      workspaceId: data.workspaceId,
      userId: data.userId,
    });
    if (existingMember) {
      throw new AppError("member already exists", HTTP_STATUS.BAD_REQUEST);
    }

    await this._workspaceMemberRepo.create(data);
  }

  async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    return !!member;
  }

  async getMembers(
    workspaceId: string,
    userId: string,
    page: number
  ): Promise<PaginatedResponseDto<WorkspaceMemberListDto[]>> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const isOwner = await this._workspaceRepo.isOwner(workspaceId, userId);
    if (!isOwner) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const rawMembers = await this._workspaceMemberRepo.getMembers(
      workspaceId,
      skip,
      limit
    );

    const members = rawMembers.data.map((member) => {
      return {
        name: member.user.firstName,
        email: member.user.email,
        role: member.role,
        _id: member.user.userId,
      };
    });

    const totalPages = Math.ceil(rawMembers.count / limit);

    return { data: members, totalPages, total: rawMembers.count };
  }
}
