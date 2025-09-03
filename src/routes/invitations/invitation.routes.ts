import { inject, injectable } from "tsyringe";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { BaseRoute } from "../base.routes";
import { IInvitationController } from "../../types/controller-interfaces/IInvitationController";

@injectable()
export class InvitationRoutes extends BaseRoute {
  constructor(
    @inject("IInvitationController")
    private _invitationController: IInvitationController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/workspace/:token/accept",
      authenticateToken,
      this._invitationController.acceptInvitation.bind(
        this._invitationController
      )
    );
    this._router.get(
      "/workspace/:workspaceId",
      authenticateToken,
      this._invitationController.getAllInvitations.bind(
        this._invitationController
      )
    );
    this._router.delete(
      "/workspace/:workspaceId/:email",
      authenticateToken,
      this._invitationController.removeInvitation.bind(
        this._invitationController
      )
    );
  }
}
