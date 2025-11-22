import { inject, injectable } from "tsyringe";
import { IPreferenceController } from "../types/controller-interfaces/IPreferenceController";
import { IPreferenceService } from "../types/service-interface/IPreferenceService";
import { Request, Response } from "express";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { UpdatePreferenceDto } from "../types/dtos/preference/preference.dto";

@injectable()
export class PreferenceController implements IPreferenceController {
  constructor(
    @inject("IPreferenceService") private _preferenceService: IPreferenceService
  ) {}

  async getUserPreferences(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const preferences = await this._preferenceService.getUserPreferences(
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: preferences,
    });
  }

  async updateUserPreferences(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const preferenceData = req.body as Omit<UpdatePreferenceDto, "userId">;

    await this._preferenceService.updateUserPreferences({
      ...preferenceData,
      userId,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
    });
  }
}
