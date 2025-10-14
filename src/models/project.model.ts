import { model, Schema } from "mongoose";
import { IProject } from "../types/entities/IProject";
import { ProjectTemplateEnum } from "../types/enums/project-template.enum";

const projectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    normalizedName: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    template: {
      type: String,
      required: true,
      enum: ProjectTemplateEnum,
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
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const projectModel = model<IProject>("project", projectSchema);
