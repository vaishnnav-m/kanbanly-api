import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../base.routes";
import { IWorkspaceMemberController } from "../../../types/controller-interfaces/IWorkspaceMemberController";

@injectable()
export class WorkspaceMembersRoutes extends BaseRoute {
  constructor(
    @inject("IWorkspaceMemberController")
    private _memberController: IWorkspaceMemberController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.get(
      "/",
      this._memberController.getMembers.bind(this._memberController)
    );
    this._router.get(
      "/me",
      this._memberController.getCurrentMember.bind(this._memberController)
    );
    this._router.get(
      "/search",
      this._memberController.searchMember.bind(this._memberController)
    );
  }
}
