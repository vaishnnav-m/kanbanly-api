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
  }
}
