import { inject, injectable } from "tsyringe";
import { IInvitationController } from "../types/controller-interfaces/IInvitationController";
import { IInvitationService } from "../types/service-interface/IInvitationService";
import { Request, Response } from "express";
import { CreateInvitationBodyDto } from "../types/dtos/workspaces/invitation.dto";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class InvitationController implements IInvitationController {
  constructor(
    @inject("IInvitationService") private _invitationService: IInvitationService
  ) {}

  async createInvitation(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId;
    const { invitedEmail, role } = req.body as CreateInvitationBodyDto;
    const invitedBy = req.user?.userid;

    if (!invitedBy) {
      throw new AppError(
        "Unauthorized: Missing user information",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._invitationService.createInvitation({
      workspaceId,
      invitedBy,
      invitedEmail,
      role,
    });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Invitaion send successfully!" });
  }

  async acceptInvitation(req: Request, res: Response) {
    const token = req.params.token;
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._invitationService.acceptInvitation(token, userId);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Joined to the workspace successfully" });
  }

  async getAllInvitations(req: Request, res: Response) {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const invitations = await this._invitationService.getAllInvitations(
      workspaceId,
      userId
    );

    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_FETCHED,
        data: invitations,
      });
  }
}
