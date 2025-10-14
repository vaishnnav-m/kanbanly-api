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
}
