import { inject, injectable } from "tsyringe";
import {
  WorkspaceMemberDto,
  workspaceRoles,
} from "../types/dtos/workspaces/workspace-member.dto";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";

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
}
