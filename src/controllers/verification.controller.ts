import { Request, Response } from "express";
import { IVerificationController } from "../types/controller-interfaces/IVerificationController";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { inject, injectable } from "tsyringe";
import { IVerificationService } from "../types/service-interface/IVerificationService";
import { ITokenService } from "../types/service-interface/ITokenService";
import { setAuthCookies } from "../shared/utils/cookieHelper.utils";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";
import { config } from "../config";

@injectable()
export class VerificationController implements IVerificationController {
  constructor(
    @inject("IVerificationService")
    private _verificationService: IVerificationService,
    @inject("ITokenService") private _tokenService: ITokenService
  ) {}

  async verifyEmail(req: Request, res: Response) {
    const token = req.query.token as string;
    if (!token) {
      throw new AppError(
        "Verification token missing.",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const user = await this._verificationService.processVerification(token);

    const accessToken = this._tokenService.generateAccessToken({
      userid: user.userId as string,
      email: user.email,
      role: user.isAdmin ? "admin" : "user",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid: user.userId as string,
      email: user.email,
      role: user.isAdmin ? "admin" : "user",
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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
      data: {
        user,
        role: user.isAdmin ? "admin" : "user",
      },
    });
  }

  async resendEmail(req: Request, res: Response) {
    const email = req.query.email as string;
    if (!email) {
      throw new AppError("Email is not provided", HTTP_STATUS.BAD_REQUEST);
    }

    await this._verificationService.sendVerificationEmail(email);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_SEND,
    });
  }
}
