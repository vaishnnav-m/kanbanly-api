import { inject, injectable } from "tsyringe";
import { IProjectService } from "../types/service-interface/IProjectService";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { CreateProjectDto } from "../types/dtos/project/project.dto";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IWorkspaceRepository") private _workspaceRepo: IWorkspaceRepository
  ) {}

  async addProject(data: CreateProjectDto): Promise<void> {
    const { name, createdBy, workspaceId } = data;
    const normalizedName = name.replace(/\s+/g, "").toLowerCase();

    const isProjectExists = await this._projectRepo.findOne({
      name: normalizedName,
    });
    if (isProjectExists) {
      throw new AppError(
        ERROR_MESSAGES.PROJECT_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }
    console.log("workspace id",workspaceId)
    const workspace = await this._workspaceRepo.findOne({
      workspaceId,
      createdBy,
    });
    if (!workspace) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._projectRepo.create({
      ...data,
      normalizedName,
    });
  }
}
