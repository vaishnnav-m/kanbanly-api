import { IProject } from "../../entities/IProject";
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
  createdAt?: string;
}

export type EditProjectDto = {
  projectId: string;
  userId: string;
} & Partial<Omit<CreateProjectDto, "createdBy">>;