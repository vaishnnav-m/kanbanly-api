import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../base.routes";
import { IProjectController } from "../../../types/controller-interfaces/IProjectController";

@injectable()
export class ProjectRoutes extends BaseRoute {
  constructor(
    @inject("IProjectController") private _projectController: IProjectController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._projectController.createProject.bind(this._projectController)
    );
  }
}
