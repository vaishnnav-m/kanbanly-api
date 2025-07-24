import { model, Schema } from "mongoose";
import { IProject } from "../types/entities/IProject";

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
    },
    workspaceId: {
      type: String,
      ref: "workspace",
      required: true,
    },
    createdBy: {
      type: String,
      ref: "user",
      required: true,
    },
    members: [{ type: String, ref: "workspaceMember" }],
  },
  { timestamps: true }
);

export const projectModel = model<IProject>("project", projectSchema);
