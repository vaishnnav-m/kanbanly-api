import { CreateInvitationDto } from "../dtos/workspaces/invitation.dto";

export interface IInvitaionService {
  createInvitation(data: CreateInvitationDto): Promise<void>;
}
