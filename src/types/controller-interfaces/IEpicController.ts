import { controllerMethod } from "../common/ControllerMethod";

export interface IEpicController {
  createEpic: controllerMethod;
  getAllEpics: controllerMethod;
  editEpic: controllerMethod;
}
