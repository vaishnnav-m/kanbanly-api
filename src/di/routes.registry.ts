import { container } from "tsyringe";
import { AuthRoutes } from "../routes/auth/auth.routes";
import { WorkspaceRoutes } from "../routes/workspace/workspace.route";
import { AdminRoutes } from "../routes/admin/admin.routes";
import { WorkspaceMemberRoutes } from "../routes/workspace/workspace-member.route";

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
    container.register(WorkspaceMemberRoutes, {
      useClass: WorkspaceMemberRoutes,
    });
  }
}
