import { Request, Response } from "express";
import { IAuthController } from "../types/controller-interfaces/IAuthController";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "../types/service-interface/IAuthService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ApiResponse } from "../types/common/IApiResponse";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { ITokenService } from "../types/service-interface/ITokenService";
import {
  clearAuthCookies,
  setAuthCookies,
} from "../shared/utils/cookieHelper.utils";
import AppError from "../shared/utils/AppError";
import { config } from "../config";
import { AuthUserResponseDto, userDto } from "../types/dtos/auth/auth.dto";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("IAuthService") private _authService: IAuthService,
    @inject("ITokenService") private _tokenService: ITokenService
  ) {}

  async registerUser(req: Request, res: Response) {
    const user = await this._authService.register(req.body);

    const response: ApiResponse<AuthUserResponseDto> = {
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL,
      data: user,
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body as userDto;
    const responseData = await this._authService.login({ email, password });

    setAuthCookies(
      res,
      "accessToken",
      responseData.accessToken,
      config.cookies.ACCESS_COOKIE_MAXAGE as number
    );
    setAuthCookies(
      res,
      "refreshToken",
      responseData.refreshToken,
      config.cookies.REFRESH_COOKIE_MAXAGE as number
    );

    const response: ApiResponse<AuthUserResponseDto> = {
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
      data: responseData.user,
    };

    res.status(HTTP_STATUS.OK).json(response);
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    if (!email) {
      throw new AppError("Email is not provided", HTTP_STATUS.BAD_REQUEST);
    }

    await this._authService.sendForgotPassword(email);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.FORGOT_EMAIL_SEND });
  }

  async resetPassword(req: Request, res: Response) {
    const { password, token } = req.body as { password: string; token: string };

    if (!token) {
      throw new AppError("Token is not provided", HTTP_STATUS.BAD_REQUEST);
    }
    if (!password) {
      throw new AppError("Password is not provided", HTTP_STATUS.BAD_REQUEST);
    }

    await this._authService.resetPassword(token, password);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Password Reseted Successfully" });
  }

  async googleAuthCallback(req: Request, res: Response) {
    const { token } = req.body;

    if (!token) {
      throw new AppError(
        "Autherization code is missing",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await this._authService.googleAuthentication(token);

    const accessToken = this._tokenService.generateAccessToken({
      userid: user.userId,
      email: user.email,
      role: "user",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid: user.userId,
      email: user.email,
      role: "user",
    });

    setAuthCookies(
      res,
      "accessToken",
      accessToken,
      config.cookies.ACCESS_COOKIE_MAXAGE as number
    );
    setAuthCookies(
      res,
      "refreshToken",
      refreshToken,
      config.cookies.REFRESH_COOKIE_MAXAGE as number
    );

    const response: ApiResponse<AuthUserResponseDto> = {
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
      data: user,
    };

    res.status(HTTP_STATUS.OK).json(response);
  }

  async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        ERROR_MESSAGES.AUTH_NO_TOKEN_PROVIDED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const decoded = this._tokenService.verifyRefereshToken(refreshToken);
    if (!decoded) {
      throw new AppError(
        ERROR_MESSAGES.AUTH_INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const accessToken = this._tokenService.generateAccessToken({
      userid: decoded.userid,
      email: decoded.email,
      role: decoded.role,
    });

    clearAuthCookies(res, "accessToken");
    setAuthCookies(
      res,
      "accessToken",
      accessToken,
      config.cookies.ACCESS_COOKIE_MAXAGE as number
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Token generation successful",
    });
  }

  async logout(req: Request, res: Response) {
    clearAuthCookies(res, "accessToken");
    clearAuthCookies(res, "refreshToken");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_LOGOUT,
    });
  }

  async adminLogin(req: Request, res: Response) {
    const { email, password } = req.body as userDto;
    const responseData = await this._authService.adminLogin({
      email,
      password,
    });

    setAuthCookies(
      res,
      "accessToken",
      responseData.accessToken,
      config.cookies.ACCESS_COOKIE_MAXAGE as number
    );
    setAuthCookies(
      res,
      "refreshToken",
      responseData.refreshToken,
      config.cookies.REFRESH_COOKIE_MAXAGE as number
    );

    const response: ApiResponse<AuthUserResponseDto> = {
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
      data: responseData.user,
    };

    res.status(HTTP_STATUS.OK).json(response);
  }

  async adminLgout(req: Request, res: Response) {
    clearAuthCookies(res, "accessToken");
    clearAuthCookies(res, "refreshToken");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ADMIN_LOGOUT,
    });
  }
}
