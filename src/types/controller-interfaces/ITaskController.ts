import { controllerMethod } from "../common/ControllerMethod";

export interface ITaskController {
  createTask: controllerMethod;
  getAllTasks: controllerMethod;
  removeTask: controllerMethod;
}
