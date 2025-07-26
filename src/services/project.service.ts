import { inject, injectable } from "tsyringe";
import { IProjectService } from "../types/service-interface/IProjectService";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import {
  CreateProjectDto,
  ProjectListDto,
} from "../types/dtos/project/project.dto";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository
  ) {}

  async addProject(data: CreateProjectDto): Promise<void> {
    const { name, createdBy, workspaceId } = data;
    const normalizedName = name.replace(/\s+/g, "").toLowerCase();

    // checking if the workspace exists or not
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

    // checking if the user is owner or not
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId: createdBy,
      workspaceId,
    });
    if (!workspaceMember || workspaceMember.role !== workspaceRoles.owner) {
      throw new AppError(ERROR_MESSAGES.NOT_OWNER, HTTP_STATUS.BAD_REQUEST);
    }

    // cheking if the project is already exists
    const isProjectExists = await this._projectRepo.findOne({
      name: normalizedName,
    });
    if (isProjectExists) {
      throw new AppError(
        ERROR_MESSAGES.PROJECT_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    // creating the project
    await this._projectRepo.create({
      ...data,
      normalizedName,
    });
  }

  async getAllProjects(
    workspaceId: string,
    userId: string
  ): Promise<ProjectListDto[] | null> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
    });
    if (!workspaceMember) {
      return null;
    }

    // getting the role to get projects user have access
    const role = workspaceMember.role;
    let query: any = {
      workspaceId,
    };
    if (role === workspaceRoles.member) {
      query.members = workspaceId;
    }

    const projectsData = await this._projectRepo.find(query);
    const projects = projectsData.map((project) => {
      return { name: project.name, description: project.description };
    });

    return projects;
  }
}
