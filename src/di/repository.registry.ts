import { container } from "tsyringe";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { WorkspaceRepository } from "../repositories/workspace.repository";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { WorkspaceMemberRepository } from "../repositories/workspace-member.repository";
import { IInvitationRepository } from "../types/repository-interfaces/IInvitationRepository";
import { InvitationRepository } from "../repositories/invitation.repository";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { ProjectRepository } from "../repositories/project.repository";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";
import { TaskRepository } from "../repositories/task.repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IUserRepository>("IUserRepository", {
      useClass: UserRepository,
    });
    container.register<IWorkspaceRepository>("IWorkspaceRepository", {
      useClass: WorkspaceRepository,
    });
    container.register<IWorkspaceMemberRepository>(
      "IWorkspaceMemberRepository",
      {
        useClass: WorkspaceMemberRepository,
      }
    );
    container.register<IInvitationRepository>("IInvitationRepository", {
      useClass: InvitationRepository,
    });
    container.register<IProjectRepository>("IProjectRepository", {
      useClass: ProjectRepository,
    });
    container.register<ITaskRepository>("ITaskRepository", {
      useClass: TaskRepository,
    });
  }
}
