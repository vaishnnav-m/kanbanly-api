import { model, Schema } from "mongoose";
import { INotification } from "../types/entities/INotification";

const notificationSchema = new Schema<INotification>(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {
      type: String,
    },
    token: {
      type: String,
    },
    workspaceName: {
      type: String,
    },
  },
  { timestamps: true }
);

export const notificationModel = model("notification", notificationSchema);
