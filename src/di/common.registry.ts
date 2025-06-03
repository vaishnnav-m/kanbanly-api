import { container } from "tsyringe";
import { IPasswordUtils } from "../types/common/IPasswordUtils";
import { PasswordUtils } from "../shared/utils/password.utils";
import { IOtpUtils } from "../types/common/IOtpUtils";
import { OtpUtils } from "../shared/utils/otp.utils";
import { IEmailUtils } from "../types/common/IEmailUtils";
import { EmailUtils } from "../shared/utils/emailTransporter.utils";

export class CommonRegistry {
  static registerCommon(): void {
    container.register<IPasswordUtils>("IPasswordUtils", {
      useClass: PasswordUtils,
    });
    container.register<IOtpUtils>("IOtpUtils", {
      useClass: OtpUtils,
    });
    container.register<IEmailUtils>("IEmailUtils", {
      useClass: EmailUtils,
    });
  }
}
