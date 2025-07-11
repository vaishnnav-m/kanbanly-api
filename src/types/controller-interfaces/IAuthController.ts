import { controllerMethod } from "../common/ControllerMethod";

export interface IAuthController {
  registerUser: controllerMethod;
  login: controllerMethod;
  googleAuthCallback: controllerMethod;
  refreshAccessToken: controllerMethod;
  logout: controllerMethod;
  adminLogin: controllerMethod;
  adminLgout: controllerMethod;
}
