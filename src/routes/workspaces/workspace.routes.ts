import { inject, injectable } from "tsyringe";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IWorkspaceController } from "../../types/controller-interfaces/IWorkspaceController";
import { BaseRoute } from "../base.routes";
import { IInvitationController } from "../../types/controller-interfaces/IInvitationController";
import { ProjectRoutes } from "./projects/project.routes";
import { WorkspaceMembersRoutes } from "./members/members.routes";

@injectable()
export class WorkspaceRoutes extends BaseRoute {
  constructor(
    @inject("IWorkspaceController")
    private _workspaceController: IWorkspaceController,
    @inject("IInvitationController")
    private _invitationController: IInvitationController,
    @inject(WorkspaceMembersRoutes)
    private _membersRoutes: WorkspaceMembersRoutes,
    @inject(ProjectRoutes) private _projectRoutes: ProjectRoutes
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
  }
}
