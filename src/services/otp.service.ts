import { inject, injectable } from "tsyringe";
import { IOtpService } from "../interfaces/service-interface/IOtpService";
import { IOtpRepository } from "../interfaces/repository-interfaces/IOtpRepository";
import { IOtpUtils } from "../interfaces/common/IOtpUtils";
import { IEmailUtils } from "../interfaces/common/IEmailUtils";

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject("IOtpRepository") private _otpRepository: IOtpRepository,
    @inject("IOtpUtils") private _otpUtil: IOtpUtils,
    @inject("IEmailUtils") private _emailUtil: IEmailUtils
  ) {}
  async sendOtp(email: string): Promise<void> {
    const otp = this._otpUtil.generateOtp(6);

    const otpData = {
      email,
      otp,
      expiresAt: new Date(Date.now() + 60 * 1000),
    };
    await this._otpRepository.generateOtp(otpData);
    await this._emailUtil.sendEmail(email, "Email Verification", otp);
  }
}
