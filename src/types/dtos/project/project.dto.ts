export interface CreateProjectDto {
  name: string;
  description: string;
  workspaceId: string;
  createdBy: string;
}

export interface ProjectListDto {
  name: string;
  description: string;
}
