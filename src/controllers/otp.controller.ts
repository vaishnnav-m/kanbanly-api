import { inject, injectable } from "tsyringe";
import { IOtpController } from "../types/controller-interfaces/IOtpControllder";
import { Request, Response } from "express";
import { IOtpService } from "../types/service-interface/IOtpService";
import { ApiResponse } from "../types/common/IApiResponse";
import { IOtp } from "../types/IOtp";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";

@injectable()
export class OtpController implements IOtpController {
  constructor(@inject("IOtpService") private _otpService: IOtpService) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.AUTH_INVALID_TOKEN,
        });
        return;
      }

      const { email } = req.user;
      await this._otpService.sendOtp(email);

      const response: ApiResponse<IOtp> = {
        success: true,
        message: SUCCESS_MESSAGES.OTP_SEND,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error ? error : ERROR_MESSAGES.UNEXPECTED_SERVER_ERROR,
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.AUTH_INVALID_TOKEN,
        });
        return;
      }
      const { email } = req.user;
      const { otp }: { email: string; otp: string } = req.body;
      await this._otpService.verifyOtpService(email, otp);

      const response: ApiResponse<IOtp> = {
        success: true,
        message: SUCCESS_MESSAGES.OTP_VERIFIED,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      console.log(error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error ? error : ERROR_MESSAGES.UNEXPECTED_SERVER_ERROR,
      });
    }
  }
}
