export interface IProject {
  name: string;
  description: string;
  normalizedName: string;
  workspaceId: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}
