import { inject, injectable } from "tsyringe";
import { ISprintController } from "../../../../types/controller-interfaces/ISprintController";
import { BaseRoute } from "../../../base.routes";

@injectable()
export class SprintRoutes extends BaseRoute {
  constructor(
    @inject("ISprintController") private _epicController: ISprintController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._epicController.createSprint.bind(this._epicController)
    );
  }
}
