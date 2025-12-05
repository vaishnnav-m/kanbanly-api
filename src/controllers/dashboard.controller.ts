import { inject, injectable } from "tsyringe";
import { IDashboardController } from "../types/controller-interfaces/IDashBoardController";
import { IDashboardService } from "../types/service-interface/IDashboardService";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import AppError from "../shared/utils/AppError";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject("IDashboardService") private _dashboardService: IDashboardService
  ) {}

  async getDashboardData(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const data = await this._dashboardService.getDashboardData(
      workspaceId,
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data,
    });
  }
}
