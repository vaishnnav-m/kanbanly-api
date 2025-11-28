import { EventEmitter } from "events";

export const notificationEvents = new EventEmitter();

export enum NotificationEvent {
  Notification = "notification",
}
