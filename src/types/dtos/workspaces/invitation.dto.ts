import { IInvitation } from "../../entities/IInvitation";
import { workspaceRoles } from "./workspace-member.dto";

export interface CreateInvitationDto {
  workspaceId: string;
  invitedEmail: string;
  role: workspaceRoles;
  invitedBy: string;
}

export type CreateInvitationBodyDto = Omit<
  CreateInvitationDto,
  "invitedBy" | "workspaceId"
>;

export type invitationListingDto = Omit<
  IInvitation,
  "_id" | "invitationToken" | "workspaceId"
>;
