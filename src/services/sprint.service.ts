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
import { IProjectService } from "../types/service-interface/IProjectService";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import { TaskStatus } from "../types/dtos/task/task.dto";

@injectable()
export class SprintService implements ISprintService {
  constructor(
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("ISprintRepository") private _sprintRepo: ISprintRepository,
    @inject("IProjectService") private _projectService: IProjectService,
    @inject("IWorkItemRepository") private _workItemRepo: IWorkItemRepository
  ) {}

  private async _handleSprintCompletion(sprintId: string) {
    const incompleteworkItemsIds = (
      await this._workItemRepo.find({
        sprintId: sprintId,
        status: { $ne: TaskStatus.Completed },
      })
    ).map((issue) => issue.taskId);

    if (incompleteworkItemsIds.length) {
      await this._workItemRepo.updateMany(
        { taskId: { $in: incompleteworkItemsIds } },
        { $set: { sprintId: null } }
      );
    }
  }

  async createSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (workspaceMember.role == workspaceRoles.member) {
      throw new AppError(ERROR_MESSAGES.ACTION_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    const project = await this._projectService.getOneProject(
      workspaceId,
      userId,
      projectId
    );

    const activeSprint = await this._sprintRepo.findOne({
      projectId,
      status: SprintStatus.Active,
    });
    if (activeSprint) {
      throw new AppError(
        ERROR_MESSAGES.ACTIVE_SPRINT_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    const projectSprints = await this._sprintRepo.find({ projectId });
    const projectKeyPrefix = project.key.split("-")[0];

    let maxSprintNumber = 0;
    projectSprints.forEach((sprint) => {
      const match = sprint.name.match(
        new RegExp(`^${projectKeyPrefix}-Sprint-(\\d+)$`)
      );
      if (match && match[1]) {
        const sprintNum = parseInt(match[1], 10);
        if (sprintNum > maxSprintNumber) {
          maxSprintNumber = sprintNum;
        }
      }
    });

    // Generate the new name
    const newSprintNumber = maxSprintNumber + 1;
    const sprintName = `${projectKeyPrefix}-Sprint-${newSprintNumber}`;
    const normalizedName = normalizeString(sprintName);

    const newSprint = {
      sprintId: uuidV4(),
      name: sprintName,
      normalizedName,
      goal: "",
      status: SprintStatus.Future,
      workspaceId,
      projectId,
      createdBy: userId,
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
      status: sprint.status,
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
      goal: sprint.goal,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
    };

    return mappedSprint;
  }

  async updateSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintId: string,
    sprintData: Partial<CreateSprintDto>
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (workspaceMember.role == workspaceRoles.member) {
      throw new AppError(ERROR_MESSAGES.ACTION_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    const activeSprint = await this._sprintRepo.findOne({
      projectId,
      status: SprintStatus.Active,
    });
    if (activeSprint) {
      throw new AppError(
        ERROR_MESSAGES.ACTIVE_SPRINT_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    let normalizedName = "";
    if (sprintData.name) {
      normalizedName = normalizeString(sprintData.name);
      const exisitingSprint = await this._sprintRepo.findOne({
        normalizedName,
      });

      if (exisitingSprint) {
        throw new AppError(
          ERROR_MESSAGES.SPRINT_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    const newSprint = {
      ...(normalizedName && { name: sprintData.name, normalizedName }),
      ...(sprintData.goal && { goal: sprintData.goal }),
      ...(sprintData.startDate && { startDate: sprintData.startDate }),
      ...(sprintData.endDate && { endDate: sprintData.endDate }),
    };

    if (!Object.values(newSprint).length) {
      return;
    }

    await this._sprintRepo.update({ projectId, sprintId }, newSprint);
  }

  async startSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintId: string,
    sprintData: Partial<CreateSprintDto>
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (workspaceMember.role == workspaceRoles.member) {
      throw new AppError(ERROR_MESSAGES.ACTION_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    const workItemCount = await this._workItemRepo.count({ sprintId });
    if (workItemCount <= 0) {
      throw new AppError(ERROR_MESSAGES.EMPTY_SPRINT, HTTP_STATUS.BAD_REQUEST);
    }

    const activeSprint = await this._sprintRepo.findOne({
      projectId,
      status: SprintStatus.Active,
    });
    if (activeSprint) {
      throw new AppError(
        ERROR_MESSAGES.ACTIVE_SPRINT_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    let normalizedName = "";
    if (sprintData.name) {
      normalizedName = normalizeString(sprintData.name);
      const exisitingSprint = await this._sprintRepo.findOne({
        normalizedName,
      });

      if (exisitingSprint) {
        throw new AppError(
          ERROR_MESSAGES.SPRINT_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    const newSprint = {
      ...(normalizedName && { name: sprintData.name, normalizedName }),
      ...(sprintData.goal && { goal: sprintData.goal }),
      ...(sprintData.startDate && { startDate: sprintData.startDate }),
      ...(sprintData.endDate && { endDate: sprintData.endDate }),
      status: SprintStatus.Active,
    };

    if (!Object.values(newSprint).length) {
      return;
    }

    await this._sprintRepo.update({ projectId, sprintId }, newSprint);
  }

  async getActiveSprint(
    userId: string,
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

    const sprint = await this._sprintRepo.findOne({
      projectId,
      status: SprintStatus.Active,
    });

    if (!sprint) {
      throw new AppError(
        ERROR_MESSAGES.NO_ACTIVE_SPRINT,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (new Date() >= sprint.endDate) {
      this._sprintRepo.update(
        { sprintId: sprint.sprintId, projectId },
        { status: SprintStatus.Completed }
      );

      this._handleSprintCompletion(sprint.sprintId);

      throw new AppError(
        ERROR_MESSAGES.NO_ACTIVE_SPRINT,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const mappedSprint: SprintResponseDto = {
      sprintId: sprint.sprintId,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
    };

    return mappedSprint;
  }

  async completeSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }

    const activeSprint = await this._sprintRepo.findOne({
      projectId,
      status: "active",
    });

    if (!activeSprint) {
      throw new AppError(
        ERROR_MESSAGES.NO_ACTIVE_SPRINT,
        HTTP_STATUS.NOT_FOUND
      );
    }

    this._handleSprintCompletion(activeSprint.sprintId);

    await this._sprintRepo.update(
      { sprintId },
      { status: SprintStatus.Completed }
    );
  }
}
