import { container } from "tsyringe";
import { IUserController } from "../interfaces/controller-interfaces/IUserController";
import { UserController } from "../controllers/user.controller";
import { IOtpController } from "../interfaces/controller-interfaces/IOtpControllder";
import { OtpController } from "../controllers/otp.controller";

export class ControllerRegistry {
  static registerController(): void {
    container.register<IUserController>("IUserController", {
      useClass: UserController,
    });
    container.register<IOtpController>("IOtpController", {
      useClass: OtpController,
    });
  }
}
