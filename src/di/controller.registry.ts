import { container } from "tsyringe";
import { IAuthController } from "../types/controller-interfaces/IAuthController";
import { AuthController } from "../controllers/auth.controller";
import { IOtpController } from "../types/controller-interfaces/IOtpControllder";
import { OtpController } from "../controllers/otp.controller";

export class ControllerRegistry {
  static registerController(): void {
    container.register<IAuthController>("IAuthController", {
      useClass: AuthController,
    });
    container.register<IOtpController>("IOtpController", {
      useClass: OtpController,
    });
  }
}
