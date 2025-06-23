import { container } from "tsyringe";
import { IAuthController } from "../types/controller-interfaces/IAuthController";
import { AuthController } from "../controllers/auth.controller";
import { IVerificationController } from "../types/controller-interfaces/IVerificationController";
import { VerificationController } from "../controllers/verification.controller";
import { IAdminController } from "../types/controller-interfaces/IAdminController";
import { AdminController } from "../controllers/admin.controller";
import { IWorkspaceController } from "../types/controller-interfaces/IWorkspaceController";
import { WorkspaceController } from "../controllers/workspace.controller";

export class ControllerRegistry {
  static registerController(): void {
    container.register<IAuthController>("IAuthController", {
      useClass: AuthController,
    });
    container.register<IVerificationController>("IVerificationController", {
      useClass: VerificationController,
    });
    container.register<IAdminController>("IAdminController", {
      useClass: AdminController,
    });
    container.register<IWorkspaceController>("IWorkspaceController", {
      useClass: WorkspaceController,
    });
  }
}
