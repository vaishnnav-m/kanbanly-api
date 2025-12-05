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
import { IPlanController } from "../types/controller-interfaces/IPlanController";
import { PlanController } from "../controllers/plan.controller";
import { ISubscriptionController } from "../types/controller-interfaces/ISubscriptionController";
import { SubscriptionController } from "../controllers/subscription.controller";
import { IEpicController } from "../types/controller-interfaces/IEpicController";
import { EpicController } from "../controllers/epic.controller";
import { ISprintController } from "../types/controller-interfaces/ISprintController";
import { SprintController } from "../controllers/sprint.controller";
import { ICloudinaryController } from "../types/controller-interfaces/ICloudinaryController";
import { CloudinaryController } from "../controllers/cloudinary.controller";
import { ChatController } from "../controllers/chat.controller";
import { IChatController } from "../types/controller-interfaces/IChatController";
import { IMessageController } from "../types/controller-interfaces/IMessageController";
import { MessageController } from "../controllers/message.controller";
import { IPreferenceController } from "../types/controller-interfaces/IPreferenceController";
import { PreferenceController } from "../controllers/preference.controller";
import { ICommentController } from "../types/controller-interfaces/ICommentController";
import { CommentController } from "../controllers/comment.controller";
import { INotificationController } from "../types/controller-interfaces/INotificationController";
import { NotificationController } from "../controllers/notification.controller";
import { IActivityController } from "../types/controller-interfaces/IActivityController";
import { ActivityController } from "../controllers/activity.controller";
import { IDashboardController } from "../types/controller-interfaces/IDashBoardController";
import { DashboardController } from "../controllers/dashboard.controller";

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
    container.register<IPlanController>("IPlanController", {
      useClass: PlanController,
    });
    container.register<ISubscriptionController>("ISubscriptionController", {
      useClass: SubscriptionController,
    });
    container.register<IEpicController>("IEpicController", {
      useClass: EpicController,
    });
    container.register<ISprintController>("ISprintController", {
      useClass: SprintController,
    });
    container.register<ICloudinaryController>("ICloudinaryController", {
      useClass: CloudinaryController,
    });
    container.register<IChatController>("IChatController", {
      useClass: ChatController,
    });
    container.register<IMessageController>("IMessageController", {
      useClass: MessageController,
    });
    container.register<IPreferenceController>("IPreferenceController", {
      useClass: PreferenceController,
    });
    container.register<ICommentController>("ICommentController", {
      useClass: CommentController,
    });
    container.register<INotificationController>("INotificationController", {
      useClass: NotificationController,
    });
    container.register<IActivityController>("IActivityController", {
      useClass: ActivityController,
    });
    container.register<IDashboardController>("IDashboardController", {
      useClass: DashboardController,
    });
  }
}
