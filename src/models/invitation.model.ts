import { model, Schema } from "mongoose";
import { IInvitation } from "../types/entities/IInvitation";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { invitationStatus } from "../types/enums/invitation-status.enum";

const invitationSchema = new Schema<IInvitation>({
  workspaceId: {
    type: String,
    ref: "workspace",
    required: true,
  },
  invitationToken: {
    type: String,
    required: true,
  },
  invitedEmail: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(workspaceRoles),
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(invitationStatus),
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const invitationModel = model<IInvitation>(
  "invitation",
  invitationSchema
);
