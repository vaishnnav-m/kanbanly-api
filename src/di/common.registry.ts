import { container } from "tsyringe";
import { IPasswordUtils } from "../interfaces/common/IPasswordUtils";
import { PasswordUtils } from "../shared/utils/password.utils";
import { IOtpUtils } from "../interfaces/common/IOtpUtils";
import { OtpUtils } from "../shared/utils/otp.utils";
import { IEmailUtils } from "../interfaces/common/IEmailUtils";
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
