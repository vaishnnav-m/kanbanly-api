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
  updateSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintId: string,
    sprintData: Partial<CreateSprintDto>
  ): Promise<void>;
  startSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintId: string,
    sprintData: Partial<CreateSprintDto>
  ): Promise<void>;
  getActiveSprint(
    userId: string,
    workspaceId: string,
    projectId: string
  ): Promise<SprintResponseDto>;
  completeSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintId: string
  ): Promise<void>;
}
