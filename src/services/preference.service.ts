import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { IPreferenceService } from "../types/service-interface/IPreferenceService";
import { IPreferenceRepository } from "../types/repository-interfaces/IPreferenceRepository";
import { IUserService } from "../types/service-interface/IUserService";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import {
  PreferenceResponseDto,
  UpdatePreferenceDto,
} from "../types/dtos/preference/preference.dto";

@injectable()
export class PreferenceService implements IPreferenceService {
  constructor(
    @inject("IPreferenceRepository")
    private _preferenceRepo: IPreferenceRepository,
    @inject("IUserService") private _userService: IUserService
  ) {}

  async createPreferences(userId: string): Promise<void> {
    const userData = await this._userService.getUserData(userId);
    if (!userData) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const newPreference = {
      preferenceId: uuidv4(),
      userId: userId,
      dueDateReminder: {
        app: true,
        email: true,
      },
      taskAssigned: {
        app: true,
        email: true,
      },
      mention: {
        app: true,
        email: true,
      },
    };

    await this._preferenceRepo.create(newPreference);
  }

  async getUserPreferences(userId: string): Promise<PreferenceResponseDto> {
    const userData = await this._userService.getUserData(userId);
    if (!userData) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const preference = await this._preferenceRepo.findOne({ userId });

    if (!preference) {
      throw new AppError(
        ERROR_MESSAGES.PREFERENCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      preferenceId: preference.preferenceId,
      userId,
      taskAssigned: preference.taskAssigned,
      mention: preference.mention,
      dueDateReminder: preference.dueDateReminder,
    };
  }

  async updateUserPreferences(data: UpdatePreferenceDto): Promise<void> {
    const userData = await this._userService.getUserData(data.userId);
    if (!userData) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const preferenceData = {
      ...(data.taskAssigned && { taskAssigned: data.taskAssigned }),
      ...(data.mention && { mention: data.mention }),
      ...(data.dueDateReminder && { dueDateReminder: data.dueDateReminder }),
    };

    if (!Object.keys(preferenceData).length) {
      return;
    }

    await this._preferenceRepo.update({ userId: data.userId }, preferenceData);
  }
}
