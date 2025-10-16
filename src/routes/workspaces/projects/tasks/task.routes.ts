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
    this._router.get(
      "/:taskId",
      this._taskController.getOneTask.bind(this._taskController)
    );
    this._router.patch(
      "/:taskId/status",
      this._taskController.changeTaskStatus.bind(this._taskController)
    );
    this._router.put(
      "/:taskId",
      this._taskController.editTask.bind(this._taskController)
    );
    this._router.patch(
      "/:taskId/attach-parent",
      this._taskController.attachParentItem.bind(this._taskController)
    );
    this._router.patch(
      "/:taskId/attach-sprint",
      this._taskController.attachSprint.bind(this._taskController)
    );
    this._router.delete(
      "/:taskId",
      this._taskController.removeTask.bind(this._taskController)
    );
  }
}
