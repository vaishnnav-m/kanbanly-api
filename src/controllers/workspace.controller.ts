import { Request, Response } from "express";
import { IWorkspaceController } from "../types/controller-interfaces/IWorkspaceController";
import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class WorkspaceController implements IWorkspaceController {
  constructor(
    @inject("IWorkspaceService") private _workspaceService: IWorkspaceService
  ) {}
  async createWorkspace(req: Request, res: Response): Promise<void> {
    const { user } = req;
    const { name, description, logo } = req.body;

    await this._workspaceService.createWorkspace({
      name,
      description,
      logo,
      createdBy: user?.userid,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Workspace creation was successfull",
    });
  }
}
