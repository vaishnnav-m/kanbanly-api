import { model, Schema, Types } from "mongoose";
import { IWorkspace } from "../types/entities/IWrokspace";

const workspaceSchema = new Schema<IWorkspace>({
  workspaceId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  logo: {
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
