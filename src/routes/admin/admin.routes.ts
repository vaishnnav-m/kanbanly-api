import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { IAdminController } from "../../types/controller-interfaces/IAdminController";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/admin.middleware";

@injectable()
export class AdminRoutes extends BaseRoute {
  constructor(
    @inject("IAdminController") private _adminController: IAdminController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.get(
      "/users",
      authenticateToken,
      checkRole("admin"),
      this._adminController.getAllUsers.bind(this._adminController)
    );

    this._router.patch(
      "/users/:id/status",
      authenticateToken,
      checkRole("admin"),
      this._adminController.updateUserStatus.bind(this._adminController)
    );

    this._router.get(
      "/analytics",
      authenticateToken,
      checkRole("admin"),
      this._adminController.getAnalytics.bind(this._adminController)
    );
  }
}
