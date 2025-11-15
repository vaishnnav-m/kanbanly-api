import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IChatController } from "../types/controller-interfaces/IChatController";
import { IChatService } from "../types/service-interface/IChatService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import AppError from "../shared/utils/AppError";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject("IChatService") private _chatService: IChatService) {}

  async createChat(req: Request, res: Response) {
    const data = req.body as { memberId: string };
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._chatService.createChat({
      type: "direct",
      participants: [data.memberId, userId],
      workspaceId,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }

  async getUserChats(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const chats = await this._chatService.getUserChats(userId, workspaceId);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: chats,
    });
  }

  async getOneChat(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userid;
    const chatId = req.params.chatId;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const chat = await this._chatService.getOneChat(
      userId,
      workspaceId,
      chatId
    );

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: chat,
    });
  }
}
