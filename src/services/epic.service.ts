import { inject, injectable } from "tsyringe";
import { IEpicService } from "../types/service-interface/IEpicService";
import { IEpicRepository } from "../types/repository-interfaces/IEpicRepository";
import { EpicCreationDto } from "../types/dtos/epic/epic.dto";
import { normalizeString } from "../shared/utils/stringNormalizer";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class EpicService implements IEpicService {
  constructor(
    @inject("IEpicRepository") private _epicRepo: IEpicRepository,
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService
  ) {}

  async createEpic(epicData: EpicCreationDto): Promise<void> {
    // checking the user role
    const workspaceMember = await this._workspaceMemberService.getCurrentMember(
      epicData.workspaceId,
      epicData.createdBy
    );
    if (!workspaceMember || workspaceMember.role === workspaceRoles.member) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // checking if the epic already exists
    const normalized = normalizeString(epicData.title);
    const exisitingEpic = await this._epicRepo.findOne({ normalized });
    if (exisitingEpic) {
      throw new AppError(
        ERROR_MESSAGES.EPIC_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    //  save data
    const newEpicData = {
      epicId: uuidv4(),
      title: epicData.title,
      normalized,
      ...(epicData.description && { description: epicData.description }),
      workspaceId: epicData.workspaceId,
      projectId: epicData.projectId,
      createdBy: epicData.createdBy,
    };
    await this._epicRepo.create(newEpicData);
  }
}
