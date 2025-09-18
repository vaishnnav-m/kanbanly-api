import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { IPlanController } from "../../types/controller-interfaces/IPlanController";
import { checkRole } from "../../middlewares/admin.middleware";
import { authenticateToken } from "../../middlewares/auth.middleware";

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
      authenticateToken,
      checkRole("admin"),
      this._planController.createPlan.bind(this._planController)
    );
    this._router.get(
      "/",
      this._planController.getAllPlans.bind(this._planController)
    );
    this._router.get(
      "/:planId",
      this._planController.getPlanById.bind(this._planController)
    );
    this._router.put(
      "/:planId",
      this._planController.editPlan.bind(this._planController)
    );
  }
}
