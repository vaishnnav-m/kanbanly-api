import { inject, injectable } from "tsyringe";
import {
  EditWorkspaceMemberDto,
  WorkspaceMemberDto,
  WorkspaceMemberResponseDto,
  workspaceRoles,
} from "../types/dtos/workspaces/workspace-member.dto";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { PaginatedResponseDto } from "../types/dtos/paginated.dto";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";

@injectable()
export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IUserRepository") private _userRepo: IUserRepository
  ) {}

  async addMember(data: WorkspaceMemberDto): Promise<void> {
    const user = await this._userRepo.findOne({ userId: data.userId });
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.MEMBER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

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
      throw new AppError(
        ERROR_MESSAGES.ALREADY_MEMBER,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const workspaceMember: Omit<IWorkspaceMember, "createdAt"> = {
      workspaceId: data.workspaceId,
      userId: data.userId,
      email: user.email,
      name: user.firstName,
      role: data.role,
      isActive: true,
    };

    await this._workspaceMemberRepo.create(workspaceMember);
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
  ): Promise<PaginatedResponseDto<WorkspaceMemberResponseDto[]>> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const member = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
      isActive: true,
    });
    if (!member) {
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

    const isOwner = member.role === "owner";

    const filteredData = isOwner
      ? rawMembers.data
      : rawMembers.data.filter((member) => member.isActive);

    const members = filteredData.map((member) => {
      return {
        name: member.user.firstName,
        email: member.user.email,
        role: member.role,
        _id: member.user.userId,
        isActive: member.isActive,
      };
    });

    const totalPages = Math.ceil(rawMembers.count / limit);

    return { data: members, totalPages, total: rawMembers.count };
  }

  async getCurrentMember(
    workspaceId: string,
    userId: string
  ): Promise<Omit<IWorkspaceMember, "isActive">> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
      isActive: true,
    });

    if (!workspaceMember) {
      throw new AppError(
        ERROR_MESSAGES.MEMBER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      userId: workspaceMember.userId,
      workspaceId: workspaceMember.workspaceId,
      role: workspaceMember.role,
      email: workspaceMember.email,
      name: workspaceMember.name,
      createdAt: workspaceMember.createdAt,
    };
  }

  async searchMember(
    workspaceId: string,
    userId: string,
    email: string
  ): Promise<WorkspaceMemberResponseDto> {
    const member = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
    });
    if (!member) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.NOT_FOUND);
    }

    const isAllowed = member.role !== "member";
    if (!isAllowed) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const workspaceMember = await this._workspaceMemberRepo.findOne({
      email,
      workspaceId,
      isActive: true,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return {
      email: workspaceMember.email,
      name: workspaceMember.name,
      role: workspaceMember?.role,
      isActive: workspaceMember.isActive,
    };
  }

  async editWorkspaceMember(
    workspaceId: string,
    userId: string,
    data: EditWorkspaceMemberDto
  ): Promise<void> {
    const member = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
    });
    if (!member) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.NOT_FOUND);
    }

    if (member.role !== "owner") {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (data.memberId === userId) {
      throw new AppError("You can't edit yourself", HTTP_STATUS.BAD_REQUEST);
    }

    if (data?.role === "owner") {
      throw new AppError(
        "Can't make the member owner",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const newMemberData: Partial<IWorkspaceMember> = {
      ...(data.role && { role: data.role }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    await this._workspaceMemberRepo.update(
      { userId: data.memberId, workspaceId },
      newMemberData
    );
  }
}
