import { EventEmitter } from "events";

export const appEvents = new EventEmitter();

export enum AppEvent {
  // Auth
  UserRegistered = "userRegistered",
  EmailVerified = "emailVerified",

  // Notification
  Notification = "notification",

  // Workspace
  TaskChange = "taskChange",
}
