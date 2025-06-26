import { inject, injectable } from "tsyringe";
import { CreateWorkspaceDto } from "../types/dtos/workspace.dto";
import { IWorkspace } from "../types/entities/IWrokspace";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { v4 as uuidv4 } from "uuid";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject("IWorkspaceRepository") private _workspaceRepo: IWorkspaceRepository
  ) {}

  private slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
  }

  async createWorkspace(
    workspaceData: CreateWorkspaceDto
  ): Promise<IWorkspace | null> {
    const slugName = this.slugify(workspaceData.name);
    const isExists = await this._workspaceRepo.find({ slug: slugName });

    if (isExists) {
      throw new AppError(
        "The workspace already exists",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const workspace: Partial<IWorkspace> = {
      workspaceId: uuidv4(),
      name: workspaceData.name,
      slug: slugName,
      description: workspaceData.description,
      logo: workspaceData.logo,
      createdBy: workspaceData.createdBy,
    };

    const newWorkspace = await this._workspaceRepo.create(workspace);

    return newWorkspace;
  }

  async getAllWorkspaces(userid: string): Promise<IWorkspace[] | null> {
    const workspaces: IWorkspace[] = await this._workspaceRepo.find({
      createdBy: userid,
    });
    console.log(workspaces);
    return workspaces;
  }

  async addUserWorkspaces(
    user: { user: string; role: string },
    workspaceId: string
  ): Promise<IWorkspace | null> {
    const allowedRoles = ["owner", "projectManager", "member"];
    if (!allowedRoles.includes(user.role)) {
      throw new AppError("invalid role", HTTP_STATUS.BAD_REQUEST);
    }

    const workspace = await this._workspaceRepo.findById(workspaceId);
    if (!workspace) {
      throw new AppError("workspace not found", HTTP_STATUS.BAD_REQUEST);
    }

    const alreadyExixts = workspace.members.some(
      (member) => member.user.toString() === user.user
    );
    if (alreadyExixts) {
      throw new AppError("member already exists", HTTP_STATUS.BAD_REQUEST);
    }

    return await this._workspaceRepo.pushMember(workspaceId, user);
  }
}
