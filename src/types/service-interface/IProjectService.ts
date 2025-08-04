import { CreateProjectDto, ProjectListDto } from "../dtos/project/project.dto";

export interface IProjectService {
  addProject(data: CreateProjectDto): Promise<void>;
  getAllProjects(
    workspaceId: string,
    userId: string
  ): Promise<ProjectListDto[] | null>;
  getOneProject(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<ProjectListDto>;
  removeProject(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<void>;
}
