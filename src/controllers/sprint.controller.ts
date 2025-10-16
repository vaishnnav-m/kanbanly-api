import { inject, injectable } from "tsyringe";
import { ISprintController } from "../types/controller-interfaces/ISprintController";
import { ISprintService } from "../types/service-interface/ISprintService";
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { CreateSprintDto } from "../types/dtos/sprint/sprint.dto";

@injectable()
export class SprintController implements ISprintController {
  constructor(
    @inject("ISprintService") private _sprintService: ISprintService
  ) {}

  async createSprint(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const sprintData = req.body as CreateSprintDto;
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    if (!workspaceId || !projectId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._sprintService.createSprint(
      userId,
      workspaceId,
      projectId,
      sprintData
    );

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }

  async getAllSprints(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    if (!workspaceId || !projectId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const sprints = await this._sprintService.getAllSprints(
      userId,
      workspaceId,
      projectId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: sprints,
    });
  }

  // get sprint by sprintId
  async getOneSprint(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;
    const sprintId = req.params.sprintId as string;

    if (!workspaceId || !projectId || !sprintId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const sprint = await this._sprintService.getOneSprint(
      userId,
      sprintId,
      workspaceId,
      projectId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: sprint,
    });
  }

  async updateSprint(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;
    const sprintId = req.params.sprintId as string;

    if (!workspaceId || !projectId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const sprintData = req.body as CreateSprintDto;

    await this._sprintService.updateSprint(
      userId,
      workspaceId,
      projectId,
      sprintId,
      sprintData
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }

  async startSprint(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;
    const sprintId = req.params.sprintId as string;

    if (!workspaceId || !projectId || !sprintId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const sprintData = req.body as CreateSprintDto;

    await this._sprintService.startSprint(
      userId,
      workspaceId,
      projectId,
      sprintId,
      sprintData
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.SPRINT_STARTED,
    });
  }

  // get sprint by sprintId
  async getActiveSprint(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    if (!workspaceId || !projectId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const sprint = await this._sprintService.getActiveSprint(
      userId,
      workspaceId,
      projectId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: sprint,
    });
  }
}
