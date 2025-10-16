import { inject, injectable } from "tsyringe";
import { ISprintController } from "../../../../types/controller-interfaces/ISprintController";
import { BaseRoute } from "../../../base.routes";

@injectable()
export class SprintRoutes extends BaseRoute {
  constructor(
    @inject("ISprintController") private _sprintController: ISprintController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._sprintController.createSprint.bind(this._sprintController)
    );
    this._router.get(
      "/",
      this._sprintController.getAllSprints.bind(this._sprintController)
    );
    this._router.get(
      "/active",
      this._sprintController.getActiveSprint.bind(this._sprintController)
    );
    this._router.get(
      "/:sprintId",
      this._sprintController.getOneSprint.bind(this._sprintController)
    );
    this._router.put(
      "/:sprintId",
      this._sprintController.updateSprint.bind(this._sprintController)
    );
    this._router.put(
      "/:sprintId/start",
      this._sprintController.startSprint.bind(this._sprintController)
    );
  }
}
