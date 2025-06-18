import { model, Schema, Types } from "mongoose";
import { IWorkspace } from "../types/entities/IWrokspace";

const workspaceSchema = new Schema<IWorkspace>({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "user",
    unique: true,
  },
  members: [
    {
      type: Types.ObjectId,
      ref: "user",
      unique: true,
    },
  ],
});

export const workspaceModel = model<IWorkspace>("workspace", workspaceSchema);