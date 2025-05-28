import { inject, injectable } from "tsyringe";
import { IUserController } from "../../interfaces/controller-interfaces/IUserController";
import { BaseRoute } from "../base.routes";
import { IOtpController } from "../../interfaces/controller-interfaces/IOtpControllder";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor(
    @inject("IUserController") private _userController: IUserController,
    @inject("IOtpController") private _otpController: IOtpController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.post(
      "/register",
      this._userController.registerUser.bind(this._userController)
    );
    this._router.post(
      "/send-otp",
      this._otpController.sendOtp.bind(this._otpController)
    );
  }
}
