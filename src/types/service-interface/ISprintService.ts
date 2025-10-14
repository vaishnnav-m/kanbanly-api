import { CreateSprintDto } from "../dtos/sprint/sprint.dto";

export interface ISprintService {
  createSprint(
    userId: string,
    workspaceId: string,
    projectId: string,
    sprintData: CreateSprintDto
  ): Promise<void>;
}
