import { inject, injectable } from "tsyringe";
import { CreateWorkspaceDto } from "../types/dtos/workspaces/workspace.dto";
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

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject("IWorkspaceRepository")
    private _workspaceRepo: IWorkspaceRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository
  ) {}

  private slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
  }

  async createWorkspace(
    workspaceData: CreateWorkspaceDto
  ): Promise<IWorkspace | null> {
    const slugName = this.slugify(workspaceData.name);

    const isExists = await this._workspaceRepo.findOne({
      createdBy: workspaceData.createdBy,
      slug: slugName,
    });

    if (isExists) {
      throw new AppError(
        "The workspace already exists",
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

    const newWorkspace = await this._workspaceRepo.create(workspace);

    await this._workspaceMemberService.addMember({
      userId: workspaceData.createdBy,
      workspaceId: workspace.workspaceId,
      role: workspaceRoles.owner,
    });

    return newWorkspace;
  }

  async getAllWorkspaces(userId: string): Promise<IWorkspace[] | null> {
    const memberWorkspaces: IWorkspaceMember[] =
      await this._workspaceMemberRepo.find({ userId });

    const memberWorkspaceIds = memberWorkspaces.map((workspace) =>
      workspace.workspaceId.toString()
    );

    const workspaces: IWorkspace[] =
      await this._workspaceRepo.findAllWorkspaces(memberWorkspaceIds, userId);
    return workspaces;
  }
}
