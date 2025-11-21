import { container } from "tsyringe";
import { AuthRoutes } from "../routes/auth/auth.routes";
import { WorkspaceRoutes } from "../routes/workspaces/workspace.routes";
import { AdminRoutes } from "../routes/admin/admin.routes";
import { InvitationRoutes } from "../routes/invitations/invitation.routes";
import { UserRoutes } from "../routes/user/user.routes";
import { PlanRoutes } from "../routes/plan/plan.routes";
import { SubscriptionRoutes } from "../routes/subscription/subscription.routes";
import { SprintRoutes } from "../routes/workspaces/projects/sprints/sprint.routes";
import { EpicRoutes } from "../routes/workspaces/projects/epics/epic.routes";
import { CloudinaryRoutes } from "../routes/cloudinary/cloudinary.routes";
import { ChatRoutes } from "../routes/workspaces/chats/chat.routes";

export class RoutesRegistry {
  static registerRoutes(): void {
    container.register(AuthRoutes, {
      useClass: AuthRoutes,
    });
    container.register(AdminRoutes, {
      useClass: AdminRoutes,
    });
    container.register(WorkspaceRoutes, {
      useClass: WorkspaceRoutes,
    });
    container.register(InvitationRoutes, {
      useClass: InvitationRoutes,
    });
    container.register(UserRoutes, {
      useClass: UserRoutes,
    });
    container.register(PlanRoutes, {
      useClass: PlanRoutes,
    });
    container.register(SubscriptionRoutes, {
      useClass: SubscriptionRoutes,
    });
    container.register(EpicRoutes, {
      useClass: EpicRoutes,
    });
    container.register(SprintRoutes, {
      useClass: SprintRoutes,
    });
    container.register(CloudinaryRoutes, {
      useClass: CloudinaryRoutes,
    });
    container.register(ChatRoutes, {
      useClass: ChatRoutes,
    });
  }
}
