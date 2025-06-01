import { Request, Response } from "express";
import { IAuthController } from "../interfaces/controller-interfaces/IAuthController";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "../interfaces/service-interface/IAuthService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ApiResponse } from "../interfaces/common/IApiResponse";
import { IUser } from "../interfaces/IUser";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";
import { ITokenService } from "../interfaces/service-interface/ITokenService";
import { setAuthCookies } from "../shared/utils/cookieHelper.utils";
import { userDto } from "../interfaces/dtos/createUser.dto";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("IAuthService") private _authService: IAuthService,
    @inject("ITokenService") private _tokenService: ITokenService
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const user: IUser = await this._authService.register(req.body);

      const accessToken = this._tokenService.generateAccessToken({
        userId: user.id,
        isVerified: user.isEmailVerified,
        role: user.isAdmin ? "Admin" : "User",
      });

      const refreshToken = this._tokenService.generateRefreshToken({
        userId: user.id,
        isVerified: user.isEmailVerified,
        role: user.isAdmin ? "Admin" : "User",
      });

      setAuthCookies(res, "userAccessToken", accessToken);
      setAuthCookies(res, "userRefreshToken", refreshToken);
      setAuthCookies(res, "isVerified", user.isEmailVerified.toString());

      const response: ApiResponse<IUser> = {
        success: true,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      console.log(error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error ? error : "Internal Server Error",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const user: IUser = await this._authService.login(req.body);

      if (!user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      const accessToken = this._tokenService.generateAccessToken({
        userId: user.id,
        isVerified: user.isEmailVerified,
        role: user.isAdmin ? "Admin" : "User",
      });

      const refreshToken = this._tokenService.generateRefreshToken({
        userId: user.id,
        isVerified: user.isEmailVerified,
        role: user.isAdmin ? "Admin" : "User",
      });

      setAuthCookies(res, "userAccessToken", accessToken);
      setAuthCookies(res, "userRefreshToken", refreshToken);
      setAuthCookies(res, "isVerified", user.isEmailVerified.toString());

      const response: ApiResponse<Omit<userDto, "password">> = {
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error:any) {
      console.log(error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error ? error : "Internal Server Error",
      });
    }
  }
}
