import { inject, injectable } from "tsyringe";
import {
  CreateInvitationDto,
  invitationListingDto,
} from "../types/dtos/workspaces/invitation.dto";
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
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { INotificationService } from "../types/service-interface/INotificationService";

@injectable()
export class InvitationService implements IInvitationService {
  private _frontendUrl: string;
  constructor(
    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IEmailService") private _mailService: IEmailService,
    @inject("IUserRepository") private _userRepo: IUserRepository,
    @inject("ISubscriptionService")
    private _subscriptionService: ISubscriptionService,
    @inject("INotificationService")
    private _notificationService: INotificationService
  ) {
    this._frontendUrl = config.cors.ALLOWED_ORIGIN;
  }

  async createInvitation(data: CreateInvitationDto): Promise<void> {
    const workspace = await this._workspaceRepo.findByWorkspaceID(
      data.workspaceId
    );
    if (!workspace) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (data.invitedBy !== workspace.createdBy) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const subscription = await this._subscriptionService.getUserSubscription(
      data.invitedBy
    );
    const members = await this._workspaceMemberRepo.find({
      userId: data.invitedBy,
      workspaceId: data.workspaceId,
    });

    const memberLimit = subscription?.limits.members;
    if (memberLimit !== "unlimited" && Number(memberLimit) <= members.length) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_LIMIT_EXCEED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await this._userRepo.findByEmail(data.invitedEmail);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (user) {
      const isMember = await this._workspaceMemberService.isMember(
        data.workspaceId,
        user.userId
      );
      if (isMember) {
        throw new AppError(ERROR_MESSAGES.ALREADY_MEMBER, HTTP_STATUS.CONFLICT);
      }
    }

    const existingInvitation = await this._invitationRepo.findOne({
      workspaceId: data.workspaceId,
      invitedEmail: data.invitedEmail,
      status: "pending",
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

    await this._invitationRepo.create({
      workspaceId: data.workspaceId,
      invitedBy: data.invitedBy,
      invitationToken,
      invitedEmail: data.invitedEmail,
      role: data.role,
      status: invitationStatus.pending,
      expiresAt,
    });

    await this._notificationService.createNotification({
      title: "Invitation Received",
      message: `You’ve been invited to join the workspace ${workspace.name}.`,
      userId: user?.userId,
      type: "INVITATION",
      token: invitationToken,
      workspaceName: workspace.name,
    });

    const invitationLink = `${this._frontendUrl}/join-workspace?token=${invitationToken}`;
    await this._mailService.sendInvitationEmail(
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
    if (!invitation || invitation.status !== "pending") {
      throw new AppError(
        "Invalid or already used invitation link.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (invitation.expiresAt < new Date()) {
      throw new AppError(ERROR_MESSAGES.EXPIRED_LINK, HTTP_STATUS.BAD_REQUEST);
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
      { invitationToken: token },
      { status: invitationStatus.accepted }
    );
  }

  async getAllInvitations(
    workspaceId: string,
    userId: string
  ): Promise<invitationListingDto[]> {
    const workspace = await this._workspaceRepo.findOne({ workspaceId });
    if (!workspace || workspace.createdBy !== userId) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.FORBIDDEN
      );
    }

    const invitations = await this._invitationRepo.find({
      workspaceId,
      status: { $ne: invitationStatus.accepted },
    });

    const mapped = invitations.map(
      (invitation): invitationListingDto => ({
        invitedEmail: invitation.invitedEmail,
        invitedBy: invitation.invitedBy,
        expiresAt: invitation.expiresAt,
        role: invitation.role,
        status: invitation.status,
      })
    );

    return mapped;
  }

  async removeInvitation(
    workspaceId: string,
    userId: string,
    email: string
  ): Promise<void> {
    const workspace = await this._workspaceRepo.findOne({ workspaceId });
    if (!workspace || workspace.createdBy !== userId) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.FORBIDDEN
      );
    }

    const invitation = await this._invitationRepo.findOne({
      workspaceId,
      invitedEmail: email,
    });
    if (!invitation) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._invitationRepo.delete({ workspaceId, invitedEmail: email });
  }
}
