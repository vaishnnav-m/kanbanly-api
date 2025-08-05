import { inject, injectable } from "tsyringe";
import { IUserController } from "../types/controller-interfaces/IUserController";
import { IUserService } from "../types/service-interface/IUserService";
import { Request, Response } from "express";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class UserController implements IUserController {
  constructor(@inject("IUserService") private _userService: IUserService) {}

  async getUserData(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const userData = await this._userService.getUserData(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: userData,
    });
  }

  async updateUserData(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    const { firstName, lastName } = req.body;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._userService.editUserData({ firstName, lastName, userId });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_EDITED });
  }

  async updateUserPassword(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new AppError("Passwords are required", HTTP_STATUS.BAD_REQUEST);
    }

    await this._userService.editUserPassword({
      oldPassword,
      newPassword,
      userId,
    });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_EDITED });
  }
}
