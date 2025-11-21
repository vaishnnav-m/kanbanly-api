import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../../base.routes";
import { IChatController } from "../../../types/controller-interfaces/IChatController";
import { MessageRoutes } from "./messages/message.routes";

@injectable()
export class ChatRoutes extends BaseRoute {
  constructor(
    @inject("IChatController") private _chatController: IChatController,
    @inject(MessageRoutes) private _messageRoutes: MessageRoutes
  ) {
    super({ mergeParams: true });
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/",
      this._chatController.createChat.bind(this._chatController)
    );
    this._router.get(
      "/",
      this._chatController.getUserChats.bind(this._chatController)
    );
    this._router.get(
      "/:chatId",
      this._chatController.getOneChat.bind(this._chatController)
    );
    this._router.use("/:chatId/messages", this._messageRoutes.router);
  }
}
