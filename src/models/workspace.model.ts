import { model, Schema, Types } from "mongoose";
import { IWorkspace } from "../types/entities/IWrokspace";

const memberSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "projectManager", "member"],
      default: "member",
      required: true,
    },
  },
  { _id: false }
);

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
    required: true,
  },
  members: [memberSchema],
});

export const workspaceModel = model<IWorkspace>("workspace", workspaceSchema);
