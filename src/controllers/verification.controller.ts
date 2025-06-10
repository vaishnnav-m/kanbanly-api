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

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string;
    if (!token) {
      throw new AppError(
        "Verification token missing.",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const user = await this._verificationService.processVerification(token);

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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
    });
  }

  async resendEmail(req: Request, res: Response): Promise<void> {
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
