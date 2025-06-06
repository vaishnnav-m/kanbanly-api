import { inject, injectable } from "tsyringe";
import { IAuthController } from "../../types/controller-interfaces/IAuthController";
import { BaseRoute } from "../base.routes";
import { IOtpController } from "../../types/controller-interfaces/IOtpControllder";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IVerificationController } from "../../types/controller-interfaces/IVerificationController";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor(
    @inject("IAuthController") private _authController: IAuthController,
    @inject("IVerificationController")
    private _verificationController: IVerificationController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.post(
      "/signup",
      this._authController.registerUser.bind(this._authController)
    );
    this._router.post(
      "/login",
      this._authController.login.bind(this._authController)
    );
    this._router.get(
      "/logout",
      authenticateToken,
      this._authController.logout.bind(this._authController)
    );
    this._router.get(
      "/verify-email",
      this._verificationController.verifyEmail.bind(
        this._verificationController
      )
    );
  }
}
