import { controllerMethod } from "../common/ControllerMethod";

export interface ISprintController {
  createSprint: controllerMethod;
  getAllSprints: controllerMethod;
  getOneSprint: controllerMethod;
  updateSprint: controllerMethod;
  startSprint: controllerMethod;
  getActiveSprint: controllerMethod;
}
