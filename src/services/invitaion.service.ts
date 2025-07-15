import { inject, injectable } from "tsyringe";
import { CreateInvitationDto } from "../types/dtos/workspaces/invitation.dto";
import { IInvitationService } from "../types/service-interface/IInvitationService";
import { IInvitationRepository } from "../types/repository-interfaces/IInvitationRepository";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { invitationStatus } from "../types/enums/invitation-status.enum";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";
import { IEmailService } from "../types/service-interface/IEmailService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";

@injectable()
export class InvitationService implements IInvitationService {
  private _frontendUrl: string;
  constructor(
    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IEmailService") private _mailService: IEmailService,
    @inject("IUserRepository") private _userRepo: IUserRepository
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

    if (data.invitedBy !== workspace.createdBy) {
      throw new AppError("You don't have permission", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await this._userRepo.findByEmail(data.invitedEmail);
    console.log(user);
    if (user) {
      const isMember = await this._workspaceMemberService.isMember(
        data.workspaceId,
        user.userId
      );
      if (isMember) {
        throw new AppError(
          "User is already a member of this workspace",
          HTTP_STATUS.CONFLICT
        );
      }
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
    this._mailService.sendInvitationEmail(
      data.invitedEmail,
      workspace.name,
      data.role,
      invitationLink
    );
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this._invitationRepo.findOne({
      invitationToken: token,
    });
    if (
      !invitation ||
      invitation.status !== "pending" ||
      invitation.expiresAt < new Date()
    ) {
      throw new AppError(
        "Invalid,expired or already used invitation link.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const acceptingUser = await this._userRepo.findOne({ userId });
    if (acceptingUser?.email !== invitation.invitedEmail) {
      throw new AppError(
        "You can't use this account to accept the invitation",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await this._userRepo.findByEmail(invitation.invitedEmail);
    if (!user) {
      throw new AppError("User is not found", HTTP_STATUS.BAD_REQUEST);
    }

    await this._workspaceMemberService.addMember({
      workspaceId: invitation.workspaceId,
      userId: user.userId,
      role: invitation.role,
    });

    await this._invitationRepo.update(
      { _id: invitation._id },
      { status: invitationStatus.accepted }
    );
  }
}
