import { inject, injectable } from "tsyringe";
import {
  CreateWorkspaceDto,
  EditWorkspaceDto,
  GetOneWorkspaceDto,
  GetOneWorkspaceResponseDto,
  WorkspaceListResponseDto,
} from "../types/dtos/workspaces/workspace.dto";
import { IWorkspace } from "../types/entities/IWrokspace";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { v4 as uuidv4 } from "uuid";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("ITaskRepository") private _taskRepo: ITaskRepository
  ) {}

  private slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
  }

  async createWorkspace(workspaceData: CreateWorkspaceDto): Promise<void> {
    const slugName = this.slugify(workspaceData.name);

    const isExists = await this._workspaceRepo.findOne({
      createdBy: workspaceData.createdBy,
      slug: slugName,
    });

    if (isExists) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const workspace = {
      workspaceId: uuidv4(),
      name: workspaceData.name,
      slug: slugName,
      description: workspaceData.description,
      logo: workspaceData.logo,
      createdBy: workspaceData.createdBy,
    };

    await this._workspaceRepo.create(workspace);

    await this._workspaceMemberService.addMember({
      userId: workspaceData.createdBy,
      workspaceId: workspace.workspaceId,
      role: workspaceRoles.owner,
    });
  }

  async getAllWorkspaces(userId: string): Promise<WorkspaceListResponseDto[]> {
    const memberWorkspaces: IWorkspaceMember[] =
      await this._workspaceMemberRepo.find({ userId });

    const memberWorkspaceIds = memberWorkspaces.map((workspace) =>
      workspace.workspaceId.toString()
    );

    const workspaces = await this._workspaceRepo.findAllWorkspaces(
      memberWorkspaceIds,
      userId
    );

    const modified = workspaces.map((workspace) => {
      return {
        workspaceId: workspace.workspaceId,
        name: workspace.name,
        description: workspace.description,
        logo: workspace.logo,
        slug: workspace.slug,
      };
    });

    return modified;
  }

  async getOneWorkspace(
    workspaceData: GetOneWorkspaceDto
  ): Promise<GetOneWorkspaceResponseDto> {
    const { workspaceId, userId } = workspaceData;

    const workspaceMember = this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const workspace = await this._workspaceRepo.findOne({
      workspaceId,
    });
    if (!workspace) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const count = await this._workspaceMemberRepo.getCount(workspaceId);

    const mappedWorkspace = {
      name: workspace.name,
      description: workspace.description || "",
      createdAt: workspace.createdAt,
      logo: workspace.logo || "",
      members: count,
    };

    return mappedWorkspace;
  }

  async editWorkspace(data: EditWorkspaceDto): Promise<void> {
    const workspace = await this._workspaceRepo.findOne({
      workspaceId: data.workspaceId,
      createdBy: data.createdBy,
    });

    if (!workspace) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    let slugName;
    if (data.name) {
      slugName = this.slugify(data.name);
      const isExists = await this._workspaceRepo.findOne({
        createdBy: data.createdBy,
        slug: slugName,
      });

      if (isExists) {
        throw new AppError(
          ERROR_MESSAGES.WORKSPACE_ALREADY_EXISTS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    const newWorkspace: Partial<IWorkspace> = {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.logo && { logo: data.logo }),
      ...(data.name && { slug: slugName }),
    };

    await this._workspaceRepo.update(
      {
        workspaceId: data.workspaceId,
        createdBy: data.createdBy,
      },
      newWorkspace
    );
  }

  async removeWorkspace(workspaceId: string, userId: string): Promise<void> {
    const workspace = await this._workspaceRepo.findOne({
      workspaceId,
      createdBy: userId,
    });
    if (!workspace) {
      throw new AppError(
        "Workspace not found or you don't have enough permission",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._workspaceMemberRepo.deleteMany({ workspaceId });
    await this._projectRepo.deleteMany({ workspaceId });
    await this._taskRepo.deleteMany({ workspaceId });
    await this._workspaceRepo.delete({ workspaceId });
  }
}
