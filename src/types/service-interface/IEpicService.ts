import {
  EpicCreationDto,
  EpicDetailsDto,
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
  getEpicById(
    userId: string,
    epicId: string,
    workspaceId: string
  ): Promise<EpicDetailsDto>;
  editEpic(userId: string, epicData: EpicUpdationDto): Promise<void>;
  deleteEpic(
    userId: string,
    epicId: string,
    workspaceId: string
  ): Promise<void>;
}
