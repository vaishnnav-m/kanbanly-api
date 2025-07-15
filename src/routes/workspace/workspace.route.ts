import { inject, injectable } from "tsyringe";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IWorkspaceController } from "../../types/controller-interfaces/IWorkspaceController";
import { BaseRoute } from "../base.routes";
import { IInvitationController } from "../../types/controller-interfaces/IInvitationController";
import { zodValidate } from "../../middlewares/validate.middleware";
import { CreateInvitationSchema } from "../../types/dtos/workspaces/invitation.dto";

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
      "/:workspaceId/add-member",
      authenticateToken,
      this._invitationController.createInvitation.bind(
        this._invitationController
      )
    );
    this._router.get(
      "/:token/accept-invite",
      authenticateToken,
      this._invitationController.acceptInvitation.bind(
        this._invitationController
      )
    );
  }
}
