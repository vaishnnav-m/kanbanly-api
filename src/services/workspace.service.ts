import { inject, injectable } from "tsyringe";
import {
  CreateWorkspaceDto,
  EditWorkspaceDto,
  GetOneWorkspaceDto,
  GetOneWorkspaceResponseDto,
  IWorkspacePermissions,
  WorkspaceListResponseDto,
} from "../types/dtos/workspaces/workspace.dto";
import { IWorkspace } from "../types/entities/IWorkspace";
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
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import { normalizeString } from "../shared/utils/stringNormalizer";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { DEFAULT_WORKSPACE_PERMISSIONS } from "../shared/constants/permissions";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  private _slugify;
  constructor(
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IWorkItemRepository") private _workItemRepo: IWorkItemRepository,
    @inject("ISubscriptionService")
    private _subscriptionService: ISubscriptionService
  ) {
    this._slugify = normalizeString;
  }

  async createWorkspace(workspaceData: CreateWorkspaceDto): Promise<void> {
    const slugName = this._slugify(workspaceData.name);

    const subscription = await this._subscriptionService.getUserSubscription(
      workspaceData.createdBy
    );
    const workspaces = await this._workspaceRepo.find({
      createdBy: workspaceData.createdBy,
    });

    const workspaceLimit = subscription?.limits.workspaces;
    if (
      workspaceLimit !== "unlimited" &&
      Number(workspaceLimit) <= workspaces.length
    ) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_LIMIT_EXCEED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

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
      permissions: DEFAULT_WORKSPACE_PERMISSIONS,
    };

    await this._workspaceRepo.create(workspace);

    await this._workspaceMemberService.addMember({
      userId: workspaceData.createdBy,
      workspaceId: workspace.workspaceId,
      role: workspaceRoles.owner,
    });
  }

  async getAllWorkspaces(
    userId: string,
    role: string
  ): Promise<WorkspaceListResponseDto[]> {
    if (role === "admin") {
      const workspaces = await this._workspaceRepo.find();

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

    const memberWorkspaces: IWorkspaceMember[] =
      await this._workspaceMemberRepo.find({ userId });

    const memberWorkspaceIds = memberWorkspaces.map(
      (workspace) => workspace.workspaceId
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
      permissions: workspace.permissions,
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
      slugName = this._slugify(data.name);
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

  async updateRolePermissions(
    workspaceId: string,
    role: workspaceRoles,
    newPermissions: Partial<IWorkspacePermissions>,
    userId: string
  ): Promise<void> {
    const member = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
    });
    if (!member)
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);

    if (member.role !== "owner") {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const workspace = await this._workspaceRepo.findOne({ workspaceId });
    if (!workspace) {
      throw new AppError(
        ERROR_MESSAGES.WORKSPACE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    workspace.permissions[role] = {
      ...workspace.permissions[role],
      ...newPermissions,
    };

    this._workspaceRepo.update(
      { workspaceId },
      { permissions: workspace.permissions }
    );
  }

  async removeWorkspace(
    workspaceId: string,
    userId: string,
    role: string
  ): Promise<void> {
    if (role === "user") {
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
    }

    await this._workspaceMemberRepo.deleteMany({ workspaceId });
    await this._projectRepo.deleteMany({ workspaceId });
    await this._workItemRepo.deleteMany({ workspaceId });
    await this._workspaceRepo.delete({ workspaceId });
  }
}
