import { inject, injectable } from "tsyringe";
import { IEpicController } from "../types/controller-interfaces/IEpicController";
import { IEpicService } from "../types/service-interface/IEpicService";
import { Request, Response } from "express";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { EpicCreationDto } from "../types/dtos/epic/epic.dto";

@injectable()
export class EpicController implements IEpicController {
  constructor(@inject("IEpicService") private _epicService: IEpicService) {}
  async createEpic(req: Request, res: Response) {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const epicData = req.body as Pick<
      EpicCreationDto,
      "title" | "description" | "color"
    >;
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    if (!workspaceId || !projectId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const newEpicData = {
      title: epicData.title,
      description: epicData.description,
      color: epicData.color,
      workspaceId,
      projectId,
      createdBy: userId,
    };

    await this._epicService.createEpic(newEpicData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_CREATED,
    });
  }

  async getAllEpics(req: Request, res: Response) {
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

    const epics = await this._epicService.getAllEpics(
      userId,
      workspaceId,
      projectId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: epics,
    });
  }

  async editEpic(req: Request, res: Response) {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const epicData = req.body as Pick<
      EpicCreationDto,
      "title" | "description" | "color"
    >;
    const workspaceId = req.params.workspaceId as string;
    const epicId = req.params.epicId as string;

    if (!workspaceId || !epicId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const newEpicData = {
      epicId,
      workspaceId,
      title: epicData.title,
      description: epicData.description,
      color: epicData.color,
    };

    await this._epicService.editEpic(userId, newEpicData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }
  async deleteEpic(req: Request, res: Response) {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId as string;
    const epicId = req.params.epicId as string;

    if (!workspaceId || !epicId) {
      throw new AppError(
        ERROR_MESSAGES.INPUT_VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._epicService.deleteEpic(userId, epicId, workspaceId);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_DELETED });
  }
}
