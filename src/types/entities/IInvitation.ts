import { workspaceRoles } from "../dtos/workspaces/workspace-member.dto";
import { invitationStatus } from "../enums/invitation-status.enum";

export interface IInvitation {
  _id?: string;
  workspaceId: string;
  invitedEmail: string;
  invitationToken: string;
  invitedBy: string;
  role: workspaceRoles;
  status: invitationStatus;
  expiresAt: Date;
}
