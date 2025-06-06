import { container } from "tsyringe";
import { IBcryptUtils } from "../types/common/IBcryptUtils";
import { BcryptUtils } from "../shared/utils/password.utils";
import { IOtpUtils } from "../types/common/IOtpUtils";
import { OtpUtils } from "../shared/utils/otp.utils";
import { IEmailUtils } from "../types/common/IEmailUtils";
import { EmailUtils } from "../shared/utils/emailTransporter.utils";
import { ErrorMiddleware } from "../middlewares/error.middleware";

export class CommonRegistry {
  static registerCommon(): void {
    container.register<IBcryptUtils>("IBcryptUtils", {
      useClass: BcryptUtils,
    });
    container.register<IOtpUtils>("IOtpUtils", {
      useClass: OtpUtils,
    });
    container.register<IEmailUtils>("IEmailUtils", {
      useClass: EmailUtils,
    });
    container.register<ErrorMiddleware>("ErrorMiddleware", {
      useClass: ErrorMiddleware,
    });
  }
}
