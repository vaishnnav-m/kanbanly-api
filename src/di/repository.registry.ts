import { container } from "tsyringe";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IPasswordUtils } from "../interfaces/IPasswordUtils";
import { PasswordUtils } from "../shared/utils/password.utils";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IUserRepository>("IUserRepository", {
      useClass: UserRepository,
    });

    container.register<IPasswordUtils>("IPasswordUtils", {
      useClass: PasswordUtils,
    });
  }
}
