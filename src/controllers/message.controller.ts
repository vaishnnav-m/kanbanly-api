import { inject, injectable } from "tsyringe";
import { IMessageController } from "../types/controller-interfaces/IMessageController";
import { IMessageService } from "../types/service-interface/IMessageService";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class MessageController implements IMessageController {
  constructor(
    @inject("IMessageService") private _messageService: IMessageService
  ) {}

  async getChatMessages(req: Request, res: Response): Promise<void> {
    const chatId = req.params.chatId;

    const messages = await this._messageService.getChatMessages(chatId);

    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_FETCHED,
        data: messages,
      });
  }
}
