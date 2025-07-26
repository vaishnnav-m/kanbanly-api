import { controllerMethod } from "../common/ControllerMethod";

export interface IProjectController {
  createProject: controllerMethod;
  getAllProjects: controllerMethod;
}
