import { CreateProjectDto, ProjectListDto } from "../dtos/project/project.dto";

export interface IProjectService {
  addProject(data: CreateProjectDto): Promise<void>;
  getAllProjects(workspaceId: string, userId: string): Promise<ProjectListDto[] | null>;
}
