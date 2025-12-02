import { model, Schema } from "mongoose";
import { IActivity } from "../types/entities/IActivity";
import { ActivityTypeEnum } from "../types/enums/activity-type.enum";

const activitySchema = new Schema<IActivity>(
  {
    activityId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
    },
    taskId: {
      type: String,
    },
    entityType: {
      type: String,
      required: true,
      enum: Object.values(ActivityTypeEnum),
    },
    entityId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    oldValue: {
      type: Object,
    },
    newValue: {
      type: Object,
    },
    member: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const activityModel = model("activity", activitySchema);
