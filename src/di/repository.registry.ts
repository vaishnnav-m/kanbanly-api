import { container } from "tsyringe";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IWorkspaceRepository } from "../types/repository-interfaces/IWorkspaceRepository";
import { WorkspaceRepository } from "../repositories/workspace.repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IUserRepository>("IUserRepository", {
      useClass: UserRepository,
    });
    container.register<IWorkspaceRepository>("IWorkspaceRepository", {
      useClass: WorkspaceRepository,
    });
  }
}
