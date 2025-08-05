import { container } from "tsyringe";
import { IAuthController } from "../types/controller-interfaces/IAuthController";
import { AuthController } from "../controllers/auth.controller";
import { IVerificationController } from "../types/controller-interfaces/IVerificationController";
import { VerificationController } from "../controllers/verification.controller";
import { IAdminController } from "../types/controller-interfaces/IAdminController";
import { AdminController } from "../controllers/admin.controller";
import { IWorkspaceController } from "../types/controller-interfaces/IWorkspaceController";
import { WorkspaceController } from "../controllers/workspace.controller";
import { IWorkspaceMemberController } from "../types/controller-interfaces/IWorkspaceMemberController";
import { WorkspaceMemberController } from "../controllers/workspace-member.controller";
import { IInvitationController } from "../types/controller-interfaces/IInvitationController";
import { InvitationController } from "../controllers/invitation.controller";
import { IProjectController } from "../types/controller-interfaces/IProjectController";
import { ProjectController } from "../controllers/project.controller";
import { ITaskController } from "../types/controller-interfaces/ITaskController";
import { TaskController } from "../controllers/task.controller";
import { IUserController } from "../types/controller-interfaces/IUserController";
import { UserController } from "../controllers/user.controller";

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
    container.register<IWorkspaceMemberController>(
      "IWorkspaceMemberController",
      {
        useClass: WorkspaceMemberController,
      }
    );
    container.register<IInvitationController>("IInvitationController", {
      useClass: InvitationController,
    });
    container.register<IProjectController>("IProjectController", {
      useClass: ProjectController,
    });
    container.register<ITaskController>("ITaskController", {
      useClass: TaskController,
    });
    container.register<IUserController>("IUserController", {
      useClass: UserController,
    });
  }
}
