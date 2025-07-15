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
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/:token/accept",
      authenticateToken,
      this._invitationController.acceptInvitation.bind(
        this._invitationController
      )
    );
  }
}
