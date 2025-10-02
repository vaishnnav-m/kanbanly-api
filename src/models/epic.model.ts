import { model, Schema } from "mongoose";
import { IEpic } from "../types/entities/IEpic";

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
    description: {
      type: String,
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
  },
  { timestamps: true }
);

export const epicModel = model("epic", epicSchema);
