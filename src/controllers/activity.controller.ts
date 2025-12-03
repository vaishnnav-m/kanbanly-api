import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IActivityController } from "../types/controller-interfaces/IActivityController";
import { IActivityService } from "../types/service-interface/IActivityService";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class ActivityController implements IActivityController {
  constructor(
    @inject("IActivityService") private _activityService: IActivityService
  ) {}

  async getTaskActivities(req: Request, res: Response) {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const taskId = req.params.taskId;

    const taskActivities = await this._activityService.getTaskAcivities(taskId);

    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_FETCHED,
        data: taskActivities,
      });
  }
}
