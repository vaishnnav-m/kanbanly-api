import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IUserController } from "../../types/controller-interfaces/IUserController";

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    @inject("IUserController") private _userController: IUserController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.get(
      "/me",
      authenticateToken,
      this._userController.getUserData.bind(this._userController)
    );
    this._router.put(
      "/me",
      authenticateToken,
      this._userController.updateUserData.bind(this._userController)
    );
    this._router.patch(
      "/me/password",
      authenticateToken,
      this._userController.updateUserPassword.bind(this._userController)
    );
  }
}
