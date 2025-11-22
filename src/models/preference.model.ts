import { model, Schema } from "mongoose";
import {
  INotificationPreference,
  IPreference,
} from "../types/entities/IPreference";

const notificationTypeSchema = new Schema<INotificationPreference>(
  {
    app: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const preferenceSchema = new Schema<IPreference>(
  {
    preferenceId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    taskAssigned: {
      type: notificationTypeSchema,
      default: () => ({}),
    },
    taskCompleted: {
      type: notificationTypeSchema,
      default: () => ({}),
    },
    dueDateReminder: {
      type: notificationTypeSchema,
      default: () => ({}),
    },
    mention: {
      type: notificationTypeSchema,
      default: () => ({}),
    },
    invitation: {
      type: notificationTypeSchema,
      default: () => ({}),
    },
    sprint: {
      type: notificationTypeSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export const preferenceModel = model("preference", preferenceSchema);
