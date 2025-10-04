import { projectStatus } from "../../enums/project-status.enum";
import { ProjectTemplateEnum } from "../../enums/project-template.enum";

export interface CreateProjectDto {
  name: string;
  key: string;
  description: string;
  template: ProjectTemplateEnum;
  workspaceId: string;
  createdBy: string;
}

export interface ProjectListDto {
  projectId: string;
  name: string;
  key: string;
  description: string;
  template: ProjectTemplateEnum;
  members: string[];
  status?: projectStatus;
  lastUpdated?: string;
  createdAt?: string;
}

export type EditProjectDto = {
  projectId: string;
  userId: string;
} & Partial<Omit<CreateProjectDto, "createdBy">>;
