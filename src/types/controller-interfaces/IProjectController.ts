import { controllerMethod } from "../common/ControllerMethod";

export interface IProjectController {
  createProject: controllerMethod;
  getAllProjects: controllerMethod;
  getOneProject: controllerMethod;
  editProject: controllerMethod;
  deleteProject: controllerMethod;
  addMember: controllerMethod;
}
