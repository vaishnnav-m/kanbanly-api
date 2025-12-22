import { model, Schema } from "mongoose";
import { IWorkspace } from "../types/entities/IWorkspace";
import { IWorkspacePermissions } from "../types/dtos/workspaces/workspace.dto";

const permissionSchema = new Schema<IWorkspacePermissions>(
  {
    workspaceEdit: { type: Boolean, default: false },
    workspaceMemberAdd: { type: Boolean, default: false },
    workspaceMemberDelete: { type: Boolean, default: false },

    projectMemberAdd: { type: Boolean, default: false },
    projectMemberDelete: { type: Boolean, default: false },

    projectCreate: { type: Boolean, default: false },
    projectEdit: { type: Boolean, default: false },
    projectDelete: { type: Boolean, default: false },

    taskCreate: { type: Boolean, default: false },
    taskEdit: { type: Boolean, default: false },
    taskDelete: { type: Boolean, default: false },
    taskAssign: { type: Boolean, default: false },

    epicCreate: { type: Boolean, default: false },
    epicEdit: { type: Boolean, default: false },
    epicDelete: { type: Boolean, default: false },

    sprintCreate: { type: Boolean, default: false },
    sprintEdit: { type: Boolean, default: false },
    sprintDelete: { type: Boolean, default: false },
  },
  { _id: false }
);

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
    permissions: {
      owner: {
        type: permissionSchema,
        required: true,
      },
      projectManager: {
        type: permissionSchema,
        required: true,
      },
      member: {
        type: permissionSchema,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const workspaceModel = model<IWorkspace>("workspace", workspaceSchema);
