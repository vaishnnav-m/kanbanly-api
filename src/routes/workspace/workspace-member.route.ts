import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { IWorkspaceMemberController } from "../../types/controller-interfaces/IWorkspaceMemberController";

@injectable()
export class WorkspaceMemberRoutes extends BaseRoute {
  constructor(
    @inject("IWorkspaceMemberController")
    private _workspaceMemberController: IWorkspaceMemberController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._workspaceMemberController.addUser.bind(
        this._workspaceMemberController
      )
    );
  }
}
