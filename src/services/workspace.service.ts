import { inject, injectable } from "tsyringe";
import { CreateWorkspaceDto } from "../types/dtos/workspace.dto";
import { IWorkspace } from "../types/entities/IWrokspace";
import { IWorkspaceService } from "../types/service-interface/IWorkspaceService";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { v4 as uuidv4 } from "uuid";

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
    const workspace: Partial<IWorkspace> = {
      workspaceId: uuidv4(),
      name: workspaceData.name,
      slug: this.slugify(workspaceData.name),
      description: workspaceData.description,
      createdBy: workspaceData.createdBy,
    };

    const newWorkspace = await this._workspaceRepo.create(workspace);

    return newWorkspace;
  }
}
