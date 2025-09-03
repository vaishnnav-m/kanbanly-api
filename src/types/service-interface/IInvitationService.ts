import {
  CreateInvitationDto,
  invitationListingDto,
} from "../dtos/workspaces/invitation.dto";

export interface IInvitationService {
  createInvitation(data: CreateInvitationDto): Promise<void>;
  acceptInvitation(token: string, userId: string): Promise<void>;
  getAllInvitations(
    workspaceId: string,
    userId: string
  ): Promise<invitationListingDto[]>;
  removeInvitation(
    workspaceId: string,
    userId: string,
    email: string
  ): Promise<void>;
}
