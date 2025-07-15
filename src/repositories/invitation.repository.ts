import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { IInvitationRepositoy } from "../types/repository-interfaces/IInvitationRepository";
import { IInvitation } from "../types/entities/IInvitation";
import { invitationModel } from "../models/invitation.model";

@injectable()
export class InvitationRepository
  extends BaseRepository<IInvitation>
  implements IInvitationRepositoy
{
  constructor() {
    super(invitationModel);
  }
}
