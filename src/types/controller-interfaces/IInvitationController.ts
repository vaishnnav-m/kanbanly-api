import { controllerMethod } from "../common/ControllerMethod";

export interface IInvitationController {
  createInvitation: controllerMethod;
  acceptInvitation: controllerMethod;
  getAllInvitations: controllerMethod;
  removeInvitation: controllerMethod;
}
