import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IEpicService } from "../types/service-interface/IEpicService";
import { IEpicRepository } from "../types/repository-interfaces/IEpicRepository";
import {
  EpicCreationDto,
  EpicDetailsDto,
  EpicResponseDto,
  EpicUpdationDto,
} from "../types/dtos/epic/epic.dto";
import { normalizeString } from "../shared/utils/stringNormalizer";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { IEpic } from "../types/entities/IEpic";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import logger from "../logger/winston.logger";
import { TaskStatus } from "../types/dtos/task/task.dto";

@injectable()
export class EpicService implements IEpicService {
  constructor(
    @inject("IEpicRepository") private _epicRepo: IEpicRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IWorkItemRepository") private _taskRepo: IWorkItemRepository
  ) {}

  async createEpic(epicData: EpicCreationDto): Promise<void> {
    // checking the user role
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      epicData.workspaceId,
      epicData.createdBy
    );
    if (!workspaceMember || workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // checking if the epic already exists
    const normalized = normalizeString(epicData.title);
    const exisitingEpic = await this._epicRepo.findOne({ normalized });
    if (exisitingEpic) {
      throw new AppError(
        ERROR_MESSAGES.EPIC_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    //  save data
    const newEpicData = {
      epicId: uuidv4(),
      title: epicData.title,
      normalized,
      status: TaskStatus.Todo,
      color: epicData.color,
      ...(epicData.description && { description: epicData.description }),
      workspaceId: epicData.workspaceId,
      projectId: epicData.projectId,
      createdBy: epicData.createdBy,
    };
    await this._epicRepo.create(newEpicData);
  }

  async getAllEpics(
    userId: string,
    workspaceId: string,
    projectId: string
  ): Promise<EpicResponseDto[]> {
    // checking if the user is a member of the workspace
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!workspaceMember) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.FORBIDDEN
      );
    }

    const epics = await this._epicRepo.find({ workspaceId, projectId });

    // geting the counts
    const epicIds = epics.map((epic) => epic.epicId);
    const taskCounts = await this._taskRepo.getTaskCountsForEpic(epicIds);

    // counts map mapped with epicIds
    const countsMap = new Map<string, { total: number; completed: number }>();
    taskCounts.forEach((count) => {
      countsMap.set(count.epicId, {
        total: count.totalTasks,
        completed: count.completedTasks,
      });
    });

    // map to the inteded result
    const mappedEpics: EpicResponseDto[] = epics.map((epic) => {
      // calculates percentage
      const counts = countsMap.get(epic.epicId) || { total: 0, completed: 0 };
      const percentageDone =
        counts.total > 0
          ? Math.round((counts.completed / counts.total) * 100)
          : 0;

      return {
        epicId: epic.epicId,
        title: epic.title,
        description: epic.description,
        color: epic.color,
        projectId: epic.projectId,
        workspaceId: epic.workspaceId,
        createdBy: epic.createdBy,
        percentageDone,
      };
    });

    return mappedEpics;
  }

  async getEpicById(
    userId: string,
    epicId: string,
    workspaceId: string
  ): Promise<EpicDetailsDto> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const epic = await this._epicRepo.findOne({ epicId, workspaceId });
    if (!epic) {
      throw new AppError(ERROR_MESSAGES.EPIC_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const tasks = await this._taskRepo.getTasksWithAssigness({ epicId });
    const mappedChildren = tasks.map((task) => ({
      taskId: task.taskId,
      task: task.task,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo: task?.assignedTo
        ? {
            name: task.assignedTo.name,
            email: task.assignedTo.email,
          }
        : null,
      status: task.status,
      workItemType: task.workItemType,
    }));

    const taskCounts = await this._taskRepo.getTaskCountsForEpic([epicId]);
    const counts = taskCounts[0] || { totalTasks: 0, completedTasks: 0 };
    const percentageDone =
      counts.totalTasks > 0
        ? Math.round((counts.completedTasks / counts.totalTasks) * 100)
        : 0;

    return {
      epicId: epic.epicId,
      title: epic.title,
      status: epic.status,
      description: epic.description,
      color: epic.color,
      children: mappedChildren,
      projectId: epic.projectId,
      workspaceId: epic.workspaceId,
      createdBy: epic.createdBy,
      dueDate: epic.dueDate,
      percentageDone,
    };
  }

  async editEpic(userId: string, epicData: EpicUpdationDto): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      epicData.workspaceId,
      userId
    );
    if (!workspaceMember || workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.FORBIDDEN
      );
    }

    let normalized = "";

    if (epicData.title) {
      // checking if the epic already exists
      normalized = normalizeString(epicData.title);
      const exisitingEpic = await this._epicRepo.findOne({ normalized });
      if (exisitingEpic) {
        throw new AppError(
          ERROR_MESSAGES.EPIC_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    const newEpicData: Partial<IEpic> = {
      ...(normalized && { title: epicData.title, normalized }),
      ...(epicData.description && { description: epicData.description }),
      ...(epicData.color && { color: epicData.color }),
      ...(epicData.dueDate && { dueDate: epicData.dueDate }),
    };

    if (!Object.values(newEpicData).length) {
      return;
    }

    await this._epicRepo.update({ epicId: epicData.epicId }, newEpicData);
  }

  async deleteEpic(
    userId: string,
    epicId: string,
    workspaceId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );
    if (!workspaceMember || workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const transactionOptions = { session };
        await this._taskRepo.detachByEpicId(epicId, transactionOptions);

        await this._epicRepo.delete({ epicId });
      });
    } catch (error: any) {
      logger.error("Transaction aborted due to an error:", error.message);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
