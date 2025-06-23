import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { IAdminController } from "../../types/controller-interfaces/IAdminController";
import { authenticateToken } from "../../middlewares/auth.middleware";

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
      this._adminController.getAllUsers.bind(this._adminController)
    );
  }
}
