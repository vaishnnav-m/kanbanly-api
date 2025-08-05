import { controllerMethod } from "../common/ControllerMethod";

export interface IUserController {
  getUserData: controllerMethod;
  updateUserData: controllerMethod;
  updateUserPassword: controllerMethod;
}
