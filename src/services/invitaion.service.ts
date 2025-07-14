import { inject, injectable } from "tsyringe";
import { CreateInvitationDto } from "../types/dtos/workspaces/invitation.dto";
import { IInvitaionService } from "../types/service-interface/IInvitaionService";
import { IInvitationRepository } from "../types/repository-interfaces/IInvitationRepository";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { invitationStatus } from "../types/enums/invitation-status.enum";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";
import { IEmailService } from "../types/service-interface/IEmailService";

@injectable()
export class InvitationService implements IInvitaionService {
  private _frontendUrl: string;
  constructor(
    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IEmailService") private mailService: IEmailService
  ) {
    this._frontendUrl = config.cors.ALLOWED_ORIGIN;
  }

  async createInvitation(data: CreateInvitationDto): Promise<void> {
    const workspace = await this._workspaceRepo.findByWorkspaceID(
      data.workspaceId
    );
    if (!workspace) {
      throw new AppError("workspace is not found", HTTP_STATUS.BAD_REQUEST);
    }

    const isMember = await this._workspaceMemberService.isMember(
      data.workspaceId,
      data.invitedBy
    );
    if (isMember) {
      throw new AppError(
        "User is already a member of this workspace",
        HTTP_STATUS.CONFLICT
      );
    }

    const existingInvitation = await this._invitationRepo.findOne({
      workspaceId: data.workspaceId,
      invitedEmail: data.invitedEmail,
      status: invitationStatus.pending,
    });
    if (existingInvitation) {
      if (existingInvitation.expiresAt < new Date()) {
        await this._invitationRepo.update(
          { _id: existingInvitation._id },
          { status: invitationStatus.expired }
        );
      } else {
        throw new AppError(
          "An invitation for this email is already pending for this workspace.",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    const invitationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    this._invitationRepo.create({
      workspaceId: data.workspaceId,
      invitedBy: data.invitedBy,
      invitationToken,
      invitedEmail: data.invitedEmail,
      role: data.role,
      status: invitationStatus.pending,
      expiresAt,
    });

    const invitationLink = `${this._frontendUrl}/join-workspace?token=${invitationToken}`;
    this.mailService.sendInvitationEmail(
      data.invitedEmail,
      workspace.name,
      data.role,
      invitationLink
    );
  }
}
