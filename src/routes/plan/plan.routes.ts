import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { IPlanController } from "../../types/controller-interfaces/IPlanController";

@injectable()
export class PlanRoutes extends BaseRoute {
  constructor(
    @inject("IPlanController") private _planController: IPlanController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._planController.createPlan.bind(this._planController)
    );
  }
}
