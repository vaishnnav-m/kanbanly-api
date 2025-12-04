import { EventEmitter } from "events";

export const workspaceEvents = new EventEmitter();

export enum WorkspaceEvent {
  TaskChange = "taskChange",
}
