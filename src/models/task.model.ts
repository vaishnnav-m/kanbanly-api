import { model, Schema } from "mongoose";
import { ITask } from "../types/entities/ITask";
import { required } from "zod/v4/core/util.cjs";

const taskShcema = new Schema<ITask>(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
    },
    task: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
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
    priority: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const taskModel = model<ITask>("task", taskShcema);
