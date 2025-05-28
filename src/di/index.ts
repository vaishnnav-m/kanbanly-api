import { CommonRegistry } from "./common.registry";
import { ControllerRegistry } from "./controller.registry";
import { RepositoryRegistry } from "./repository.registry";
import { ServiceRegistry } from "./service.registry";

export class DependencyInjection {
  static registerAll(): void {
    RepositoryRegistry.registerRepositories();
    ServiceRegistry.registerServices();
    ControllerRegistry.registerController();
    CommonRegistry.registerCommon();
  }
}
