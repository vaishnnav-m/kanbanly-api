import { controllerMethod } from "../common/ControllerMethod";

export interface IVerificationController {
  verifyEmail: controllerMethod;
  resendEmail: controllerMethod;
}
