import { Request, Response } from "express";
import { IProjectController } from "../types/controller-interfaces/IProjectController";
import { inject, injectable } from "tsyringe";
import { IProjectService } from "../types/service-interface/IProjectService";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class ProjectController implements IProjectController {
  constructor(
    @inject("IProjectService") private _projectService: IProjectService
  ) {}

  async createProject(req: Request, res: Response): Promise<void> {
    const { name, description } = req.body;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;
    console.log("workspaceId",workspaceId,"\n params",req.params)

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._projectService.addProject({
      name,
      description,
      workspaceId,
      createdBy: userId,
    });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.PROJECT_CREATED });
  }
}
