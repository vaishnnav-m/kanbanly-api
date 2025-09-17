import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { IProjectService } from "../types/service-interface/IProjectService";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import {
  CreateProjectDto,
  EditProjectDto,
  ProjectListDto,
} from "../types/dtos/project/project.dto";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import {
  WorkspaceMemberResponseDto,
  workspaceRoles,
} from "../types/dtos/workspaces/workspace-member.dto";
import { IProject } from "../types/entities/IProject";
import { projectStatus } from "../types/enums/project-status.enum";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";
import { FilterQuery } from "mongoose";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { normalizeString } from "../shared/utils/stringNormalizer";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";

@injectable()
export class ProjectService implements IProjectService {
  private _normalizeName;
  constructor(
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("ITaskRepository") private _taskRepo: ITaskRepository,
    @inject("ISubscriptionService")
    private _subscriptionService: ISubscriptionService
  ) {
    this._normalizeName = normalizeString;
  }

  async addProject(data: CreateProjectDto): Promise<void> {
    const { name, createdBy, workspaceId } = data;
    const normalizedName = this._normalizeName(name);

    // checking if the workspace exists or not
    const workspace = await this._workspaceRepo.findOne({
      workspaceId,
    });
    if (!workspace) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (workspace.createdBy !== createdBy) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // check for subscription limit
    const subscription = await this._subscriptionService.getUserSubscription(
      createdBy
    );
    const projects = await this._projectRepo.find({
      workspaceId,
      createdBy: createdBy,
    });

    const projectLimit = subscription?.limits.projects;
    if (
      projectLimit !== "unlimited" &&
      Number(projectLimit) <= projects.length
    ) {
      throw new AppError(
        ERROR_MESSAGES.PROJECT_LIMIT_EXCEED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // checking if the user is owner or not
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId: createdBy,
      workspaceId,
      isActive: true,
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
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }

    // getting the role to get projects user have access
    const role = workspaceMember.role;
    let query: any = {
      workspaceId,
    };
    if (role === workspaceRoles.member) {
      query.members = { $in: [userId] };
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
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
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
      createdAt: project.createdAt.toString(),
    };
  }

  async editProject(data: EditProjectDto): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId: data.workspaceId,
      userId: data.userId,
    });
    if (!workspaceMember || workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        "Member not exists or insufficient permission",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let normalizedName;
    if (data.name) {
      normalizedName = this._normalizeName(data.name);
      const isProjectExists = await this._projectRepo.findOne({
        name: normalizedName,
      });
      if (isProjectExists) {
        throw new AppError(
          ERROR_MESSAGES.PROJECT_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    const newProject: Partial<IProject> = {
      ...(data.name && { name: data.name }),
      ...(data.name && { normalizedName: normalizedName }),
      ...(data.description && { name: data.description }),
    };

    await this._projectRepo.update(
      {
        projectId: data.projectId,
        workspaceId: data.workspaceId,
      },
      newProject
    );
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

  async addMember(
    workspaceId: string,
    userId: string,
    projectId: string,
    email: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }
    if (workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isMemberExists = await this._workspaceMemberRepo.findOne({
      email,
      workspaceId,
    });
    if (!isMemberExists) {
      throw new AppError(
        ERROR_MESSAGES.MEMBER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const alreadyMember = await this._projectRepo.findOne({
      workspaceId,
      projectId,
      members: isMemberExists.userId,
    });
    if (alreadyMember) {
      throw new AppError(ERROR_MESSAGES.ALREADY_MEMBER, HTTP_STATUS.CONFLICT);
    }

    await this._projectRepo.update(
      { projectId, workspaceId },
      { $addToSet: { members: isMemberExists.userId } }
    );
  }

  async getMembers(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<Omit<WorkspaceMemberResponseDto, "isActive">[]> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    if (!workspaceMember) {
      throw new AppError(
        ERROR_MESSAGES.MEMBER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const project = await this._projectRepo.findOne({ workspaceId, projectId });
    const members = await this._workspaceMemberRepo.find({
      workspaceId,
      userId: { $in: project?.members },
    } as FilterQuery<IWorkspaceMember>);

    const mapedMembers = members.map((member) => ({
      _id: member.userId.toString(),
      email: member.email,
      name: member.name,
      role: member.role,
    }));

    return mapedMembers;
  }

  async removeMember(
    workspaceId: string,
    projectId: string,
    userId: string,
    userToRemove: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      workspaceId,
      userId,
    });
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }
    if (workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (userId === userToRemove) {
      throw new AppError(
        ERROR_MESSAGES.DELETE_YOURSELF,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const project = await this._projectRepo.findOne({ workspaceId, projectId });
    if (!project) {
      throw new AppError(
        ERROR_MESSAGES.PROJECT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (!project.members.includes(userToRemove)) {
      throw new AppError(
        ERROR_MESSAGES.MEMBER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const newMembers = project.members.filter(
      (memberid) => memberid !== userToRemove
    );

    await this._projectRepo.update(
      { projectId, workspaceId },
      { members: newMembers }
    );
  }
}
