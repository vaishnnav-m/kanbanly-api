import { model, Schema } from "mongoose";
import { IEpic } from "../types/entities/IEpic";
import { TaskStatus } from "../types/dtos/task/task.dto";

const epicSchema = new Schema<IEpic>(
  {
    epicId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    normalized: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: TaskStatus,
      default: TaskStatus.Todo,
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      reqiured: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const epicModel = model("epic", epicSchema);
