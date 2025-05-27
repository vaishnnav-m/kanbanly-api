import { inject, injectable } from "tsyringe";
import { IUserController } from "../../interfaces/IUserController";
import { BaseRoute } from "../base.routes";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor(
    @inject("IUserController") private userController: IUserController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.post(
      "/register",
      this.userController.registerUser.bind(this.userController)
    );
  }
}
