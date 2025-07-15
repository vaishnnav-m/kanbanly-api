import { inject, injectable } from "tsyringe";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IWorkspaceController } from "../../types/controller-interfaces/IWorkspaceController";
import { BaseRoute } from "../base.routes";
import { IInvitationController } from "../../types/controller-interfaces/IInvitationController";

@injectable()
export class WorkspaceRoutes extends BaseRoute {
  constructor(
    @inject("IWorkspaceController")
    private _workspaceController: IWorkspaceController,
    @inject("IInvitationController")
    private _invitationController: IInvitationController
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
    this._router.post(
      "/:workspaceId/invitations",
      authenticateToken,
      this._invitationController.createInvitation.bind(
        this._invitationController
      )
    );
    
  }
}
