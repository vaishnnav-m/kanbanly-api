import { controllerMethod } from "../common/ControllerMethod";

export interface ITaskController {
  createTask: controllerMethod;
  getAllTasks: controllerMethod;
  getOneTask: controllerMethod;
  getAllSubTasks: controllerMethod;
  changeTaskStatus: controllerMethod;
  editTask: controllerMethod;
  attachParentItem: controllerMethod;
  attachSprint: controllerMethod;
  removeTask: controllerMethod;
}
