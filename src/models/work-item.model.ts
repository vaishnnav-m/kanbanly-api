import { model, Schema } from "mongoose";
import { IWorkItem } from "../types/entities/IWorkItem";
import {
  TaskPriority,
  TaskStatus,
  WorkItemType,
} from "../types/dtos/task/task.dto";

const workItemSchema = new Schema<IWorkItem>(
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
      enum: Object.values(TaskStatus),
      default: TaskStatus.Todo,
      required: true,
    },
    workItemType: {
      type: String,
      enum: Object.values(WorkItemType),
      default: WorkItemType.Task,
      required: true,
    },
    epicId: {
      type: String,
    },
    sprintId: {
      type: String,
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
      enum: Object.values(TaskPriority),
      default: TaskPriority.Low,
      required: true,
    },
    parent: {
      type: String,
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
    storyPoint: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const workItemModel = model<IWorkItem>("workItem", workItemSchema);
