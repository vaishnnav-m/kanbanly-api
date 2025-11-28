import { controllerMethod } from "../common/ControllerMethod";

export interface INotificationController {
  getNotifications: controllerMethod;
  markAsRead: controllerMethod;
}
