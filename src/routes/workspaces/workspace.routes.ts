import { inject, injectable } from "tsyringe";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IWorkspaceController } from "../../types/controller-interfaces/IWorkspaceController";
import { BaseRoute } from "../base.routes";
import { IInvitationController } from "../../types/controller-interfaces/IInvitationController";
import { ProjectRoutes } from "./projects/project.routes";
import { WorkspaceMembersRoutes } from "./members/members.routes";
import { ChatRoutes } from "./chats/chat.routes";
import { IDashboardController } from "../../types/controller-interfaces/IDashBoardController";

@injectable()
export class WorkspaceRoutes extends BaseRoute {
  constructor(
    @inject("IWorkspaceController")
    private _workspaceController: IWorkspaceController,
    @inject("IInvitationController")
    private _invitationController: IInvitationController,
    @inject(WorkspaceMembersRoutes)
    private _membersRoutes: WorkspaceMembersRoutes,
    @inject("IDashboardController")
    private _dashboardController: IDashboardController,
    @inject(ProjectRoutes) private _projectRoutes: ProjectRoutes,
    @inject(ChatRoutes) private _chatRoutes: ChatRoutes
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/create",
      authenticateToken,
      this._workspaceController.createWorkspace.bind(this._workspaceController)
    );
    this._router.get(
      "/",
      authenticateToken,
      this._workspaceController.getAllWorkspaces.bind(this._workspaceController)
    );
    this._router.get(
      "/:workspaceId",
      authenticateToken,
      this._workspaceController.getOneWorkspace.bind(this._workspaceController)
    );
    this._router.post(
      "/:workspaceId/invitations",
      authenticateToken,
      this._invitationController.createInvitation.bind(
        this._invitationController
      )
    );
    this._router.put(
      "/:workspaceId",
      authenticateToken,
      this._workspaceController.editWorkspace.bind(this._workspaceController)
    );
    this._router.patch(
      "/:workspaceId/permissions",
      authenticateToken,
      this._workspaceController.updateRolePermissions.bind(
        this._workspaceController
      )
    );
    this._router.get(
      "/:workspaceId/dashboard",
      authenticateToken,
      this._dashboardController.getDashboardData.bind(this._dashboardController)
    );
    this._router.delete(
      "/:workspaceId",
      authenticateToken,
      this._workspaceController.removeWorkspace.bind(this._workspaceController)
    );
    this._router.use(
      "/:workspaceId/members",
      authenticateToken,
      this._membersRoutes.router
    );
    this._router.use(
      "/:workspaceId/projects",
      authenticateToken,
      this._projectRoutes.router
    );
    this._router.use(
      "/:workspaceId/chats",
      authenticateToken,
      this._chatRoutes.router
    );
  }
}
