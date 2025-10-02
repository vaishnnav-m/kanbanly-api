import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../../base.routes";
import { IEpicController } from "../../../../types/controller-interfaces/IEpicController";
import { authenticateToken } from "../../../../middlewares/auth.middleware";

@injectable()
export class EpicRoutes extends BaseRoute {
  constructor(
    @inject("IEpicController") private _epicController: IEpicController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      authenticateToken,
      this._epicController.createEpic.bind(this._epicController)
    );
  }
}
