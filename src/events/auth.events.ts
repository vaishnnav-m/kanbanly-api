import { EventEmitter } from "events";

export const authEvents = new EventEmitter();

export enum AuthEvent {
  UserRegistered = "userRegistered",
}
