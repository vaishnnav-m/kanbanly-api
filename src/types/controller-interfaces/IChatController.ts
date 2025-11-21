import { controllerMethod } from "../common/ControllerMethod";

export interface IChatController {
  createChat: controllerMethod;
  getUserChats: controllerMethod;
  getOneChat: controllerMethod;
}
