import { container } from "tsyringe";
import { IUserController } from "../interfaces/IUserController";
import { UserController } from "../controllers/user.controller";

export class ControllerRegistry {
  static registerController(): void {
    container.register<IUserController>("IUserController", {
      useClass: UserController,
    });
  }
}
