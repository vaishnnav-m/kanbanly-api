import { inject, injectable } from "tsyringe";
import { ISprintService } from "../types/service-interface/ISprintService";
import {
  CreateSprintDto,
  SprintResponseDto,
  SprintStatus,
} from "../types/dtos/sprint/sprint.dto";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { normalizeString } from "../shared/utils/stringNormalizer";
import { ISprintRepository } from "../types/repository-interfaces/ISprintRepository";
import { v4 as uuidV4 } from "uuid";

@injectable()
export class SprintService implements ISprintService {
  constructor(
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("ISprintRepository") private _sprintRepo: ISprintRepository
  ) {}

  async createSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintData: CreateSprintDto
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (workspaceMember.role == workspaceRoles.member) {
      throw new AppError(ERROR_MESSAGES.ACTION_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    const normalizedName = normalizeString(sprintData.name);
    const exisistingSprint = await this._sprintRepo.findOne({ normalizedName });
    if (exisistingSprint) {
      throw new AppError(
        ERROR_MESSAGES.SPRINT_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    const newSprint = {
      sprintId: uuidV4(),
      name: sprintData.name,
      normalizedName,
      goal: sprintData.goal,
      status: SprintStatus.Future,
      workspaceId,
      projectId,
      createdBy: userId,
      startDate: sprintData.startDate,
      endDate: sprintData.endDate,
    };

    await this._sprintRepo.create(newSprint);
  }

  async getAllSprints(
    userId: string,
    workspaceId: string,
    projectId: string
  ): Promise<SprintResponseDto[]> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }

    const sprints = await this._sprintRepo.find({
      projectId,
      status: { $ne: SprintStatus.Completed },
    });

    const mappedSprints: SprintResponseDto[] = sprints.map((sprint) => ({
      sprintId: sprint.sprintId,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    }));

    return mappedSprints;
  }

  async getOneSprint(
    userId: string,
    sprintId: string,
    workspaceId: string,
    projectId: string
  ): Promise<SprintResponseDto> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }

    console.log(sprintId);

    const sprint = await this._sprintRepo.findOne({
      projectId,
      sprintId,
      status: { $ne: SprintStatus.Completed },
    });

    if (!sprint) {
      throw new AppError(
        ERROR_MESSAGES.SPRINT_NOT_EXISTS,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const mappedSprint: SprintResponseDto = {
      sprintId: sprint.sprintId,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    };

    return mappedSprint;
  }
}
