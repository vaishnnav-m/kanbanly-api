import { model, Schema } from "mongoose";
import {
  INotificationPreference,
  IPreference,
} from "../types/entities/IPreference";

const notificationTypeSchema = new Schema<INotificationPreference>({
  app: {
    type: Boolean,
    default: true,
  },
  email: {
    type: Boolean,
    default: true,
  },
});

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
    },
    taskAssigned: {
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
  },
  { timestamps: true }
);

export const preferenceModel = model("preference", preferenceSchema);
