import { container } from "tsyringe";
import { IAuthController } from "../types/controller-interfaces/IAuthController";
import { AuthController } from "../controllers/auth.controller";
import { IVerificationController } from "../types/controller-interfaces/IVerificationController";
import { VerificationController } from "../controllers/verification.controller";

export class ControllerRegistry {
  static registerController(): void {
    container.register<IAuthController>("IAuthController", {
      useClass: AuthController,
    });
    container.register<IVerificationController>("IVerificationController", {
      useClass: VerificationController,
    });
  }
}
