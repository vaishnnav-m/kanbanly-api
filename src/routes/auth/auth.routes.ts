import { inject, injectable } from "tsyringe";
import { IAuthController } from "../../types/controller-interfaces/IAuthController";
import { BaseRoute } from "../base.routes";
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

    this.router.post(
      "/google/callback",
      this._authController.googleAuthCallback.bind(this._authController)
    );

    this._router.get(
      "/verify-email",
      this._verificationController.verifyEmail.bind(
        this._verificationController
      )
    );

    this._router.get(
      "/resend-email",
      this._verificationController.resendEmail.bind(
        this._verificationController
      )
    );

    this._router.post(
      "/forgot-password",
      this._authController.forgotPassword.bind(this._authController)
    );

    this._router.patch(
      "/reset-password",
      this._authController.resetPassword.bind(this._authController)
    );

    this._router.get(
      "/refresh",
      this._authController.refreshAccessToken.bind(this._authController)
    );

    this._router.get(
      "/logout",
      authenticateToken,
      this._authController.logout.bind(this._authController)
    );

    this._router.post(
      "/admin/login",
      this._authController.adminLogin.bind(this._authController)
    );

    this._router.get(
      "/admin/logout",
      authenticateToken,
      this._authController.adminLgout.bind(this._authController)
    );
  }
}
