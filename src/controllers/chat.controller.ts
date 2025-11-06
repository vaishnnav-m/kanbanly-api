import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IChatController } from "../types/controller-interfaces/IChatController";
import { IChatService } from "../types/service-interface/IChatService";
import { CreateChatDto } from "../types/dtos/chat/chat.dto";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject("IChatService") private _chatService: IChatService) {}

  async createChat(req: Request, res: Response) {
    const data = req.body as CreateChatDto;

    await this._chatService.createChat(data);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }
}
