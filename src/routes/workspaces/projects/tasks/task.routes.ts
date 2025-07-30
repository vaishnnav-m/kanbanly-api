import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../../base.routes";
import { ITaskController } from "../../../../types/controller-interfaces/ITaskController";

@injectable()
export class TaskRoutes extends BaseRoute {
  constructor(
    @inject("ITaskController") private _taskController: ITaskController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._taskController.createTask.bind(this._taskController)
    );
    this._router.get(
      "/",
      this._taskController.getAllTasks.bind(this._taskController)
    );
    this._router.delete(
      "/:taskId",
      this._taskController.removeTask.bind(this._taskController)
    );
  }
}
