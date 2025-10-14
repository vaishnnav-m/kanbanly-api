import { model, Schema } from "mongoose";
import { ISprint } from "../types/entities/ISprint";
import { SprintStatus } from "../types/dtos/sprint/sprint.dto";

const sprintSchema = new Schema<ISprint>(
  {
    sprintId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    normalizedName: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: SprintStatus,
    },
    createdBy: {
      type: String,
      required: true,
    },
    endDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const sprintModel = model("sprint", sprintSchema);
