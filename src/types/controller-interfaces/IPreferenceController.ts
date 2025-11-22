import { controllerMethod } from "../common/ControllerMethod";

export interface IPreferenceController {
  getUserPreferences: controllerMethod;
  updateUserPreferences: controllerMethod;
}
