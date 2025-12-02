import {
  ActivityResponseDto,
  CreateActivityDto,
} from "../dtos/activity/activity.dto";

export interface IActivityService {
  createActivity(data: CreateActivityDto): Promise<void>;
  getTaskAcivities(taskId: string): Promise<ActivityResponseDto[]>;
}
