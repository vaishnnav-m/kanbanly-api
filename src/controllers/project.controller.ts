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

  async getAllProjects(req: Request, res: Response): Promise<void> {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const projects = await this._projectService.getAllProjects(
      workspaceId,
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: projects,
    });
  }

  async getOneProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const project = await this._projectService.getOneProject(
      workspaceId,
      userId,
      projectId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: project,
    });
  }

  async editProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;
    const { name, description } = req.body;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._projectService.editProject({
      name,
      description,
      projectId,
      workspaceId,
      userId,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_EDITED,
    });
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._projectService.removeProject(workspaceId, userId, projectId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_DELETED,
    });
  }

  async addMember(req: Request, res: Response): Promise<void> {
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;
    const { email } = req.body;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._projectService.addMember(workspaceId, userId, projectId, email);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.MEMBER_ADDED,
    });
  }
}
