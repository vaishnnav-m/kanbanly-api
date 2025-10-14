export interface ISprint {
  sprintId: string;
  name: string;
  normalizedName: string;
  description?: string;
  workspaceId: string;
  projectId: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
}
