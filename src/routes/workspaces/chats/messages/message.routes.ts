import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../../base.routes";
import { IMessageController } from "../../../../types/controller-interfaces/IMessageController";

@injectable()
export class MessageRoutes extends BaseRoute {
  constructor(
    @inject("IMessageController") private _messageController: IMessageController
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.get(
      "/",
      this._messageController.getChatMessages.bind(this._messageController)
    );
  }
}
