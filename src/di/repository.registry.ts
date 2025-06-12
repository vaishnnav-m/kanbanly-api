import { container } from "tsyringe";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IUserRepository>("IUserRepository", {
      useClass: UserRepository,
    });
  }
}
