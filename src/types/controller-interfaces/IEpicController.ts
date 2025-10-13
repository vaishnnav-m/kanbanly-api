import { controllerMethod } from "../common/ControllerMethod";

export interface IEpicController {
  createEpic: controllerMethod;
  getAllEpics: controllerMethod;
  getEpicById: controllerMethod;
  editEpic: controllerMethod;
  deleteEpic: controllerMethod;
}
