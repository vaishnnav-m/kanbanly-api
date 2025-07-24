import { CreateProjectDto } from "../dtos/project/project.dto";

export interface IProjectService {
  addProject(data: CreateProjectDto): Promise<void>;
}
