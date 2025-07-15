import { Request, Response } from "express";
import { IVerificationController } from "../types/controller-interfaces/IVerificationController";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { inject, injectable } from "tsyringe";
import { IVerificationService } from "../types/service-interface/IVerificationService";
import { ITokenService } from "../types/service-interface/ITokenService";
import { setAuthCookies } from "../shared/utils/cookieHelper.utils";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";

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
      role: user.isAdmin ? "Admin" : "User",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid: user.userId as string,
      email: user.email,
      role: user.isAdmin ? "Admin" : "User",
    });

    setAuthCookies(res, "accessToken", accessToken, 60 * 60 * 1000);
    setAuthCookies(
      res,
      "refreshToken",
      refreshToken,
      7 * 24 * 60 * 60 * 1000
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        role:user.isAdmin ? "admin":'user'
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
