import { Request, Response } from "express";
import { IWorkspaceController } from "../types/controller-interfaces/IWorkspaceController";
import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspace } from "../types/entities/IWrokspace";
import AppError from "../shared/utils/AppError";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class WorkspaceController implements IWorkspaceController {
  constructor(
    @inject("IWorkspaceService") private _workspaceService: IWorkspaceService
  ) {}
  async createWorkspace(req: Request, res: Response) {
    const { user } = req;
    const { name, description, logo } = req.body;

    if (!user || !user.userid) {
      throw new AppError("Unautherized access", HTTP_STATUS.FORBIDDEN);
    }

    await this._workspaceService.createWorkspace({
      name,
      description,
      logo,
      createdBy: user.userid,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Workspace creation was successfull",
    });
  }

  async getAllWorkspaces(req: Request, res: Response) {
    const { user } = req;

    if (!user) {
      throw new AppError("Token is not valid", HTTP_STATUS.FORBIDDEN);
    }

    const workspaces = await this._workspaceService.getAllWorkspaces(
      user?.userid
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Successfully fetched all workspaces",
      data: workspaces,
    });
  }

  async getOneWorkspace(req: Request, res: Response) {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;
    if (!userId) {
      throw new AppError("Token is not valid", HTTP_STATUS.FORBIDDEN);
    }

    if (!workspaceId)
      throw new AppError("workspaceId is required", HTTP_STATUS.BAD_REQUEST);

    const workspace = await this._workspaceService.getOneWorkspace({
      workspaceId,
      userId,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: workspace,
    });
  }

  async editWorkspace(req: Request, res: Response) {
    const userId = req.user?.userid;
    const { name, description, logo } = req.body;
    const workspaceId = req.params.workspaceId;
    if (!userId) {
      throw new AppError("Token is not valid", HTTP_STATUS.FORBIDDEN);
    }

    await this._workspaceService.editWorkspace({
      workspaceId,
      createdBy: userId,
      description,
      logo,
      name,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }

  async removeWorkspace(req: Request, res: Response) {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;
    if (!userId) {
      throw new AppError("Token is not valid", HTTP_STATUS.FORBIDDEN);
    }

    if (!workspaceId)
      throw new AppError("workspaceId is required", HTTP_STATUS.BAD_REQUEST);

    await this._workspaceService.removeWorkspace(workspaceId, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
    });
  }
}
