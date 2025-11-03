import {
  CreateProjectDto,
  EditProjectDto,
  ProjectListDto,
} from "../dtos/project/project.dto";
import { WorkspaceMemberResponseDto } from "../dtos/workspaces/workspace-member.dto";

export interface IProjectService {
  addProject(data: CreateProjectDto): Promise<void>;
  getAllProjects(
    workspaceId: string,
    userId: string,
    filters: {
      search?: string;
      memberFilter?: string;
    },
    sorting: {
      sortBy?: string;
      order?: string;
    },
    limit?: number,
    skip?: number
  ): Promise<ProjectListDto[] | null>;
  getOneProject(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<ProjectListDto>;
  editProject(data: EditProjectDto): Promise<void>;
  removeProject(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<void>;
  addMember(
    workspaceId: string,
    userId: string,
    projectId: string,
    email: string
  ): Promise<void>;
  getMembers(
    workspaceId: string,
    userId: string,
    projectId: string
  ): Promise<Omit<WorkspaceMemberResponseDto, "isActive">[]>;
  removeMember(
    workspaceId: string,
    projectId: string,
    userId: string,
    userToRemove: string
  ): Promise<void>;
}
