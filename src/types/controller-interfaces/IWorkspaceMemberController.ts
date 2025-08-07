import { controllerMethod } from "../common/ControllerMethod";

export interface IWorkspaceMemberController {
  addUser: controllerMethod;
  getMembers: controllerMethod;
  getCurrentMember: controllerMethod;
  searchMember: controllerMethod;
  editMember: controllerMethod;
  removeMember: controllerMethod;
}
