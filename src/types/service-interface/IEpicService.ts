import { EpicCreationDto } from "../dtos/epic/epic.dto";

export interface IEpicService {
  createEpic(epicData: EpicCreationDto): Promise<void>;
}
