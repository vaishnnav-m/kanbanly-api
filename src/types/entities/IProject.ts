import { projectStatus } from "../enums/project-status.enum";
import { ProjectTemplateEnum } from "../enums/project-template.enum";

export interface IProject {
  projectId: string;
  name: string;
  normalizedName: string;
  key: string;
  description: string;
  template: ProjectTemplateEnum;
  workspaceId: string;
  createdBy: string;
  members: string[];
  status: projectStatus;
  createdAt: Date;
  updatedAt: Date;
}
