import { container } from "tsyringe";
import { AuthRoutes } from "../routes/auth/auth.routes";
import { WorkspaceRoutes } from "../routes/workspaces/workspace.routes";
import { AdminRoutes } from "../routes/admin/admin.routes";
import { InvitationRoutes } from "../routes/invitations/invitation.routes";
import { UserRoutes } from "../routes/user/user.routes";

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
  }
}
