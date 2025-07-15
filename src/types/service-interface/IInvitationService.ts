import { CreateInvitationDto } from "../dtos/workspaces/invitation.dto";

export interface IInvitationService {
  createInvitation(data: CreateInvitationDto): Promise<void>;
  acceptInvitation(token: string, userId: string): Promise<void>;
}
