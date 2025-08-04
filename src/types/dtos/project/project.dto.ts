import { projectStatus } from "../../enums/project-status.enum";

export interface CreateProjectDto {
  name: string;
  description: string;
  workspaceId: string;
  createdBy: string;
}

export interface ProjectListDto {
  projectId: string;
  name: string;
  description: string;
  members: string[];
  status?: projectStatus;
  lastUpdated?: string;
}
