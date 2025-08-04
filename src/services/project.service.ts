import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
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
import { IProject } from "../types/entities/IProject";
import { projectStatus } from "../types/enums/project-status.enum";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("ITaskRepository") private _taskRepo: ITaskRepository
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

    const project: Omit<IProject, "createdAt" | "updatedAt"> = {
      projectId: uuidv4(),
      workspaceId: data.workspaceId,
      name: data.name,
      description: data.description,
      normalizedName,
      createdBy: data.createdBy,
      members: [data.createdBy],
      status: projectStatus.active,
    };
    // creating the project
    await this._projectRepo.create(project);
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
      return {
        projectId: project.projectId,
        name: project.name,
        description: project.description,
        members: project.members,
        status: project.status,
        lastUpdated: project.updatedAt.toString(),
      };
    });

    return projects;
  }

  async getOneProject(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<ProjectListDto> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    if (!workspaceMember || workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        "Member not exists or insufficient permission",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const project = await this._projectRepo.findOne({ projectId, workspaceId });
    if (!project) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return {
      projectId: project.projectId,
      name: project.name,
      description: project.description,
      members: project.members,
      status: project.status,
      lastUpdated: project.updatedAt.toString(),
    };
  }

  async removeProject(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    if (!workspaceMember || workspaceMember.role !== workspaceRoles.owner) {
      throw new AppError(
        "Member not exists or insufficient permission",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    
    await this._taskRepo.deleteMany({ projectId, workspaceId });
    await this._projectRepo.delete({ projectId, workspaceId });
  }
}
