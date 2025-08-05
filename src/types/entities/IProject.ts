import { projectStatus } from "../enums/project-status.enum";

export interface IProject {
  projectId: string;
  name: string;
  description: string;
  normalizedName: string;
  workspaceId: string;
  createdBy: string;
  members: string[];
  status: projectStatus;
  createdAt: Date;
  updatedAt: Date;
}
