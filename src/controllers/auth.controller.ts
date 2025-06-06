import { Request, Response } from "express";
import { IAuthController } from "../types/controller-interfaces/IAuthController";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "../types/service-interface/IAuthService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ApiResponse } from "../types/common/IApiResponse";
import { IUser } from "../types/IUser";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { ITokenService } from "../types/service-interface/ITokenService";
import {
  clearAuthCookies,
  setAuthCookies,
} from "../shared/utils/cookieHelper.utils";
import AppError from "../shared/utils/AppError";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("IAuthService") private _authService: IAuthService,
    @inject("ITokenService") private _tokenService: ITokenService
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const user: IUser = await this._authService.register(req.body);

    const response: ApiResponse<Partial<IUser>> = {
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  }

  async login(req: Request, res: Response): Promise<void> {
    const user: IUser = await this._authService.login(req.body);

    const accessToken = this._tokenService.generateAccessToken({
      email: user.email,
      isVerified: user.isEmailVerified,
      role: user.isAdmin ? "Admin" : "User",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      email: user.email,
      isVerified: user.isEmailVerified,
      role: user.isAdmin ? "Admin" : "User",
    });

    setAuthCookies(res, "userAccessToken", accessToken);
    setAuthCookies(res, "userRefreshToken", refreshToken);
    setAuthCookies(res, "isVerified", user.isEmailVerified.toString());

    const response: ApiResponse<Partial<IUser>> = {
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  }

  async logout(req: Request, res: Response) {
    clearAuthCookies(res, "userAccessToken");
    clearAuthCookies(res, "userRefreshToken");
    clearAuthCookies(res, "isVerified");
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_LOGOUT,
    });
  }
}
