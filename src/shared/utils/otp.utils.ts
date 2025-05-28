import { injectable } from "tsyringe";
import { IOtpUtils } from "../../interfaces/common/IOtpUtils";
import { randomBytes } from "crypto";

@injectable()
export class OtpUtils implements IOtpUtils {
  generateOtp(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const bytes = randomBytes(length);
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += chars[bytes[i] % chars.length];
    }
    return otp;
  }
}
