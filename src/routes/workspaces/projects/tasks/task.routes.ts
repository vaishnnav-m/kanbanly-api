import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../../base.routes";
import { ITaskController } from "../../../../types/controller-interfaces/ITaskController";
import { ICommentController } from "../../../../types/controller-interfaces/ICommentController";
import { IActivityController } from "../../../../types/controller-interfaces/IActivityController";

@injectable()
export class TaskRoutes extends BaseRoute {
  constructor(
    @inject("ITaskController") private _taskController: ITaskController,
    @inject("ICommentController")
    private _commentController: ICommentController,
    @inject("IActivityController")
    private _activityController: IActivityController
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
    this._router.get(
      "/:taskId/sub-tasks",
      this._taskController.getAllSubTasks.bind(this._taskController)
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
    // comments
    this._router.post(
      "/:taskId/comments",
      this._commentController.createComment.bind(this._commentController)
    );
    this._router.get(
      "/:taskId/comments",
      this._commentController.getAllComments.bind(this._commentController)
    );
    this._router.put(
      "/:taskId/comments/:commentId",
      this._commentController.editComment.bind(this._commentController)
    );
    this._router.delete(
      "/:taskId/comments/:commentId",
      this._commentController.deleteComment.bind(this._commentController)
    );
    // activities
    this.router.get(
      "/:taskId/activities",
      this._activityController.getTaskActivities.bind(this._activityController)
    );
  }
}
