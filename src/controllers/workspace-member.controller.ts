import { Request, Response } from "express";
import { IWorkspaceMemberController } from "../types/controller-interfaces/IWorkspaceMemberController";
import {
  EditWorkspaceMemberDto,
  WorkspaceMemberDto,
} from "../types/dtos/workspaces/workspace-member.dto";
import { inject, injectable } from "tsyringe";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class WorkspaceMemberController implements IWorkspaceMemberController {
  constructor(
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService
  ) {}

  // add user to workspace by invitation
  async addUser(req: Request, res: Response): Promise<void> {
    const {
      userId: memberId,
      workspaceId,
      role,
    } = req.body as WorkspaceMemberDto;

    await this._workspaceMemberService.addMember({
      userId: memberId,
      workspaceId,
      role,
    });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "User added to workspace successfully" });
  }

  // get all members of a workspace
  async getMembers(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId;
    const pageParam = req.query.page;
    const page =
      parseInt(typeof pageParam === "string" ? pageParam : "1", 10) || 1;
    const search = req.query.search as string;

    const members = await this._workspaceMemberService.getMembers(
      workspaceId,
      userId,
      page,
      search
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: members,
    });
  }

  // get current member of a workspace
  async getCurrentMember(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId;

    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      workspaceId,
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: workspaceMember,
    });
  }

  // search member of a workspace
  async searchMember(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId;
    const email = req.query.email as string;

    const workspaceMember = await this._workspaceMemberService.searchMember(
      workspaceId,
      userId,
      email
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: workspaceMember,
    });
  }

  // edit member of a workspace
  async editMember(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId;
    const data = req.body as EditWorkspaceMemberDto;

    await this._workspaceMemberService.editWorkspaceMember(
      workspaceId,
      userId,
      data
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }

  // remove member of a workspace
  async removeMember(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    const workspaceId = req.params.workspaceId;
    const memberId = req.params.memberId;

    await this._workspaceMemberService.deleteMember(
      workspaceId,
      userId,
      memberId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }
}
