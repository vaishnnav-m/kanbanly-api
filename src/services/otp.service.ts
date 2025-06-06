import { inject, injectable } from "tsyringe";
import { IOtpService } from "../types/service-interface/IOtpService";
import { IOtpRepository } from "../types/repository-interfaces/IOtpRepository";
import { IOtpUtils } from "../types/common/IOtpUtils";
import { IEmailUtils } from "../types/common/IEmailUtils";
import { IBcryptUtils } from "../types/common/IBcryptUtils";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject("IOtpRepository") private _otpRepository: IOtpRepository,
    @inject("IOtpUtils") private _otpUtil: IOtpUtils,
    @inject("IEmailUtils") private _emailUtil: IEmailUtils,
    @inject("IBcryptUtils") private _bcryptUtil: IBcryptUtils,
    @inject("IUserRepository") private _userRepository: IUserRepository
  ) {}
  async sendOtp(email: string): Promise<void> {
    const isEmailExists = await this._userRepository.findByEmail(email);
    if (!isEmailExists || isEmailExists.isEmailVerified) {
      throw new AppError(
        "Email not exists or already verified",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const otp = this._otpUtil.generateOtp(6);
    const hashedOtp = await this._bcryptUtil.hash(otp);

    const otpData = {
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 60 * 1000),
    };

    await this._otpRepository.generateOtp(otpData);
    await this._emailUtil.sendEmail(email, "Email Verification", otp);
  }

  async verifyOtpService(email: string, otp: string): Promise<void> {
    const otpData = await this._otpRepository.findByEmail(email);
    if (!otpData) {
      throw new AppError("Invalid or Expired Otp", HTTP_STATUS.BAD_REQUEST);
    }
    if (
      new Date() > otpData.expiresAt ||
      !(await this._bcryptUtil.compare(otp, otpData.otp))
    ) {
      throw new AppError("Invalid or Expired Otp", HTTP_STATUS.BAD_REQUEST);
    }

    await this._otpRepository.delete(otpData._id as string);
    await this._userRepository.updateIsVerified(email, true);
  }
}
