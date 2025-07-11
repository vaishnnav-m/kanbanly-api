import { model, Schema, Types } from "mongoose";
import { IWorkspace } from "../types/entities/IWrokspace";
const workspaceSchema = new Schema<IWorkspace>(
  {
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
      type: String,
      ref: "user",
      required: true,
    },
    members: {
      type: [
        {
          type: Types.ObjectId,
          ref: "workspaceMember",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const workspaceModel = model<IWorkspace>("workspace", workspaceSchema);
