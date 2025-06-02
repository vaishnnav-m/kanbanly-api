import { inject, injectable } from "tsyringe";
import { IAuthController } from "../../interfaces/controller-interfaces/IAuthController";
import { BaseRoute } from "../base.routes";
import { IOtpController } from "../../interfaces/controller-interfaces/IOtpControllder";

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
    this._router.post(
      "/send-otp",
      this._otpController.sendOtp.bind(this._otpController)
    );
    this._router.post(
      "/verify-otp",
      this._otpController.verifyOtp.bind(this._otpController)
    );
    this._router.post(
      "/login",
      this._authController.login.bind(this._authController)
    );
  }
}
