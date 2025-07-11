import { controllerMethod } from "../common/ControllerMethod";

export interface IAdminController {
  getAllUsers: controllerMethod;
  updateUserStatus: controllerMethod;
}
