import { model, Schema, Types } from "mongoose";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
  {
    workspaceId: {
      type: String,
      ref: "workspace",
      required: true,
    },
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(workspaceRoles),
      required: true,
    },
  },
  { timestamps: true }
);

export const workspaceMemberModel = model<IWorkspaceMember>(
  "workspaceMember",
  workspaceMemberSchema
);
