import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IEpicController } from "../../types/controller-interfaces/IEpicController";

@injectable()
export class EpicRoutes extends BaseRoute {
  constructor(
    @inject("IEpicController") private _epicController: IEpicController
  ) {
    super();
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
