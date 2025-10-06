import {
  EpicCreationDto,
  EpicResponseDto,
  EpicUpdationDto,
} from "../dtos/epic/epic.dto";

export interface IEpicService {
  createEpic(epicData: EpicCreationDto): Promise<void>;
  getAllEpics(
    userId: string,
    workspaceId: string,
    projectId: string
  ): Promise<EpicResponseDto[]>;
  editEpic(userId: string, epicData: EpicUpdationDto): Promise<void>;
}
