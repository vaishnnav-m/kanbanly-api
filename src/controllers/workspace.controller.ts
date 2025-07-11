import { Request, Response } from "express";
import { IWorkspaceController } from "../types/controller-interfaces/IWorkspaceController";
import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspace } from "../types/entities/IWrokspace";
import AppError from "../shared/utils/AppError";

@injectable()
export class WorkspaceController implements IWorkspaceController {
  constructor(
    @inject("IWorkspaceService") private _workspaceService: IWorkspaceService
  ) {}
  async createWorkspace(req: Request, res: Response) {
    const { user } = req;
    const { name, description, logo } = req.body;

    if (!user || !user.userid) {
      throw new AppError("Unautherized access", HTTP_STATUS.UNAUTHORIZED);
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
      throw new AppError("Token is not valid", HTTP_STATUS.BAD_REQUEST);
    }

    const workspaces: IWorkspace[] | null =
      await this._workspaceService.getAllWorkspaces(user?.userid);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Successfully fetched all workspaces",
      data: workspaces,
    });
  }
}
