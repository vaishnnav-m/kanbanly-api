import { Request, Response } from "express";
import { IWorkspaceMemberController } from "../types/controller-interfaces/IWorkspaceMemberController";
import { WorkspaceMemberDto } from "../types/dtos/workspaces/workspace-member.dto";
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

  async addUser(req: Request, res: Response): Promise<void> {
    const { userId, workspaceId, role } = req.body as WorkspaceMemberDto;
    await this._workspaceMemberService.addMember({ userId, workspaceId, role });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "User added to workspace successfully" });
  }

  async getMembers(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.FORBIDDEN_ACCESS,
        HTTP_STATUS.FORBIDDEN
      );
    }
    const workspaceId = req.params.workspaceId;
    const pageParam = req.query.page;
    const page =
      parseInt(typeof pageParam === "string" ? pageParam : "1", 10) || 1;

    const members = await this._workspaceMemberService.getMembers(
      workspaceId,
      userId,
      page
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: members,
    });
  }

  async getCurrentMember(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.FORBIDDEN_ACCESS,
        HTTP_STATUS.FORBIDDEN
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

  async searchMember(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.FORBIDDEN_ACCESS,
        HTTP_STATUS.FORBIDDEN
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
}
