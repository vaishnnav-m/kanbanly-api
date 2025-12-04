import { controllerMethod } from "../common/ControllerMethod";

export interface IWorkspaceController {
  createWorkspace: controllerMethod;
  getAllWorkspaces: controllerMethod;
  getOneWorkspace: controllerMethod;
  editWorkspace: controllerMethod;
  updateRolePermissions: controllerMethod;
  removeWorkspace: controllerMethod;
}
