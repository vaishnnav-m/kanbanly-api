import { inject, injectable } from "tsyringe";
import { IAuthController } from "../../types/controller-interfaces/IAuthController";
import { BaseRoute } from "../base.routes";
import { IOtpController } from "../../types/controller-interfaces/IOtpControllder";
import { authenticateToken } from "../../middlewares/auth.middleware";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor(
    @inject("IAuthController") private _authController: IAuthController,
    @inject("IOtpController") private _otpController: IOtpController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.post(
      "/signup",
      this._authController.registerUser.bind(this._authController)
    );
    this._router.get(
      "/send-otp",
      authenticateToken,
      this._otpController.sendOtp.bind(this._otpController)
    );
    this._router.post(
      "/verify-otp",
      authenticateToken,
      this._otpController.verifyOtp.bind(this._otpController)
    );
    this._router.post(
      "/login",
      this._authController.login.bind(this._authController)
    );
  }
}
