import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { IAiController } from "../../types/controller-interfaces/IAiController";
import { authenticateToken } from "../../middlewares/auth.middleware";

@injectable()
export class AiRoutes extends BaseRoute {
  constructor(@inject("IAiController") private _aiController: IAiController) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/:workspaceId/chat",
      authenticateToken,
      this._aiController.chat.bind(this._aiController)
    );
  }
}
