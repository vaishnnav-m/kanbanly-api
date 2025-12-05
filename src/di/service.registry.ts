import { container } from "tsyringe";
import { IAuthService } from "../types/service-interface/IAuthService";
import { AuthService } from "../services/auth.service";
import { ITokenService } from "../types/service-interface/ITokenService";
import { TokenService } from "../services/jwt.service";
import { IVerificationService } from "../types/service-interface/IVerificationService";
import { VerificationService } from "../services/verification.service";
import { IGoogleService } from "../types/service-interface/IGoogleService";
import { GoogleService } from "../services/google.service";
import { IAdminService } from "../types/service-interface/IAdminService";
import { AdminService } from "../services/admin.service";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { WorkspaceService } from "../services/workspace.service";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { WorkspaceMemberService } from "../services/workspace-member.service";
import { IEmailService } from "../types/service-interface/IEmailService";
import { EmailService } from "../services/email.service";
import { IInvitationService } from "../types/service-interface/IInvitationService";
import { InvitationService } from "../services/invitaion.service";
import { ICacheService } from "../types/service-interface/ICacheService";
import { CacheService } from "../services/cache.service";
import { IProjectService } from "../types/service-interface/IProjectService";
import { ProjectService } from "../services/project.service";
import { ITaskService } from "../types/service-interface/ITaskService";
import { TaskService } from "../services/task.service";
import { IUserService } from "../types/service-interface/IUserService";
import { UserService } from "../services/user.service";
import { IPlanService } from "../types/service-interface/IPlanService";
import { PlanService } from "../services/plan.service";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { SubscriptionService } from "../services/subscription.service";
import { IWebhookService } from "../types/service-interface/IWebhookService";
import { WebhookService } from "../services/webhook.service";
import { IEpicService } from "../types/service-interface/IEpicService";
import { EpicService } from "../services/epic.service";
import { ISprintService } from "../types/service-interface/ISprintService";
import { SprintService } from "../services/sprint.service";
import { ICloudinaryService } from "../types/service-interface/ICloudinaryService";
import { CloudinaryService } from "../services/cloudinary.service";
import { IChatService } from "../types/service-interface/IChatService";
import { ChatService } from "../services/chat.service";
import { IMessageService } from "../types/service-interface/IMessageService";
import { MessageService } from "../services/message.service";
import { IPreferenceService } from "../types/service-interface/IPreferenceService";
import { PreferenceService } from "../services/preference.service";
import { ICommentService } from "../types/service-interface/ICommentService";
import { CommentService } from "../services/comment.service";
import { INotificationService } from "../types/service-interface/INotificationService";
import { NotificationService } from "../services/notification.service";
import { IActivityService } from "../types/service-interface/IActivityService";
import { ActivityService } from "../services/activity.service";
import { IPermissionService } from "../types/service-interface/IPermissionService";
import { PermissionService } from "../services/permission.service";
import { IDashboardService } from "../types/service-interface/IDashboardService";
import { DashboardService } from "../services/dashboard.service";
import { IAnalyticsService } from "../types/service-interface/IAnalyticsService";
import { AnalyticsService } from "../services/analytics.service";

export class ServiceRegistry {
  static registerServices(): void {
    container.register<IAuthService>("IAuthService", {
      useClass: AuthService,
    });
    container.register<IVerificationService>("IVerificationService", {
      useClass: VerificationService,
    });
    container.register<ITokenService>("ITokenService", {
      useClass: TokenService,
    });
    container.register<IGoogleService>("IGoogleService", {
      useClass: GoogleService,
    });
    container.register<IAdminService>("IAdminService", {
      useClass: AdminService,
    });
    container.register<IWorkspaceService>("IWorkspaceService", {
      useClass: WorkspaceService,
    });
    container.register<IWorkspaceMemberService>("IWorkspaceMemberService", {
      useClass: WorkspaceMemberService,
    });
    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });
    container.register<IInvitationService>("IInvitationService", {
      useClass: InvitationService,
    });
    container.register<ICacheService>("ICacheService", {
      useClass: CacheService,
    });
    container.register<IProjectService>("IProjectService", {
      useClass: ProjectService,
    });
    container.register<ITaskService>("ITaskService", {
      useClass: TaskService,
    });
    container.register<IUserService>("IUserService", {
      useClass: UserService,
    });
    container.register<IPlanService>("IPlanService", {
      useClass: PlanService,
    });
    container.register<ISubscriptionService>("ISubscriptionService", {
      useClass: SubscriptionService,
    });
    container.register<IWebhookService>("IWebhookService", {
      useClass: WebhookService,
    });
    container.register<IEpicService>("IEpicService", {
      useClass: EpicService,
    });
    container.register<ISprintService>("ISprintService", {
      useClass: SprintService,
    });
    container.register<ICloudinaryService>("ICloudinaryService", {
      useClass: CloudinaryService,
    });
    container.register<IChatService>("IChatService", {
      useClass: ChatService,
    });
    container.register<IMessageService>("IMessageService", {
      useClass: MessageService,
    });
    container.register<IPreferenceService>("IPreferenceService", {
      useClass: PreferenceService,
    });
    container.register<ICommentService>("ICommentService", {
      useClass: CommentService,
    });
    container.register<INotificationService>("INotificationService", {
      useClass: NotificationService,
    });
    container.register<IActivityService>("IActivityService", {
      useClass: ActivityService,
    });
    container.register<IPermissionService>("IPermissionService", {
      useClass: PermissionService,
    });
    container.register<IDashboardService>("IDashboardService", {
      useClass: DashboardService,
    });
    container.register<IAnalyticsService>("IAnalyticsService", {
      useClass: AnalyticsService,
    });
  }
}
