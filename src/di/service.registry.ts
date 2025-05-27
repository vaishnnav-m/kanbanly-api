import { container } from "tsyringe";
import { IUserService } from "../interfaces/IUserService";
import { UserService } from "../services/user.service";

export class ServiceRegistry {
  static registerServices(): void {
    container.register<IUserService>("IUserService", {
      useClass: UserService,
    });
  }
}
