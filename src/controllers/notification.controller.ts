import { inject, injectable } from "tsyringe";
import { INotificationController } from "../types/controller-interfaces/INotificationController";
import { INotificationService } from "../types/service-interface/INotificationService";
import { Request, Response } from "express";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("INotificationService")
    private _notificationService: INotificationService
  ) {}

  async getNotifications(req: Request, res: Response) {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const notifications = await this._notificationService.getNotifications(
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: notifications,
    });
  }

  async markAsRead(req: Request, res: Response) {
    const userId = req.user?.userid;
    const notificationIds = req.body as string[];
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._notificationService.markAsRead(notificationIds, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }
}
