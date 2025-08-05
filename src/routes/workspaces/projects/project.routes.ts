import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../base.routes";
import { IProjectController } from "../../../types/controller-interfaces/IProjectController";
import { TaskRoutes } from "./tasks/task.routes";

@injectable()
export class ProjectRoutes extends BaseRoute {
  constructor(
    @inject("IProjectController")
    private _projectController: IProjectController,
    @inject(TaskRoutes) private _taskRoutes: TaskRoutes
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._projectController.createProject.bind(this._projectController)
    );
    this._router.get(
      "/",
      this._projectController.getAllProjects.bind(this._projectController)
    );
    this._router.get(
      "/:projectId",
      this._projectController.getOneProject.bind(this._projectController)
    );
    this._router.put(
      "/:projectId",
      this._projectController.editProject.bind(this._projectController)
    );
    this._router.delete(
      "/:projectId",
      this._projectController.deleteProject.bind(this._projectController)
    );
    this._router.patch(
      "/:projectId/members",
      this._projectController.addMember.bind(this._projectController)
    );
    this._router.use("/:projectId/tasks", this._taskRoutes.router);
  }
}
