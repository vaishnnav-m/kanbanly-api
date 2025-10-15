import { CreateSprintDto, SprintResponseDto } from "../dtos/sprint/sprint.dto";

export interface ISprintService {
  createSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintData: CreateSprintDto
  ): Promise<void>;
  getAllSprints(
    userId: string,
    workspaceId: string,
    projectId: string
  ): Promise<SprintResponseDto[]>;
  getOneSprint(
    userId: string,
    sprintId: string,
    workspaceId: string,
    projectId: string
  ): Promise<SprintResponseDto>;
}
