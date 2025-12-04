import { registerUserEventListner } from "./listeners/auth.listener";
import { registerNotificationEventListner } from "./listeners/notification.listener";
import { registerWorkspaceEventListner } from "./listeners/workspace.listener";

export function registerEvents() {
  registerUserEventListner();
  registerNotificationEventListner();
  registerWorkspaceEventListner();
}
