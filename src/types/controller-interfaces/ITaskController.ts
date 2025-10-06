import { controllerMethod } from "../common/ControllerMethod";

export interface ITaskController {
  createTask: controllerMethod;
  getAllTasks: controllerMethod;
  getOneTask: controllerMethod;
  changeTaskStatus: controllerMethod;
  editTask: controllerMethod;
  attachParentItem: controllerMethod;
  removeTask: controllerMethod;
}
