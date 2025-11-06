import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { CreateChatDto } from "../types/dtos/chat/chat.dto";
import { IChatService } from "../types/service-interface/IChatService";
import { IChatRepository } from "../types/repository-interfaces/IChatRepository";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class ChatService implements IChatService {
  constructor(@inject("IChatRepository") private _chatRepo: IChatRepository) {}
  async createChat(data: CreateChatDto): Promise<void> {
    if (!data.participants || data.participants.length === 0) {
      throw new AppError(
        ERROR_MESSAGES.CHAT_NO_PARTICIPANTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (data.type === "direct") {
      if (data.participants.length !== 2) {
        throw new AppError(
          ERROR_MESSAGES.CHAT_DIRECT_MEMBER_LIMIT,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const existingChat = await this._chatRepo.findOne({
        type: "direct",
        participants: { $all: data.participants, $size: 2 },
      });

      if (existingChat) {
        return;
      }
    }

    if (data.type === "project") {
      if (!data.projectId) {
        throw new AppError(
          ERROR_MESSAGES.PROJECTID_REQUIRED,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const existingChat = await this._chatRepo.findOne({
        projectId: data.projectId,
      });

      if (existingChat) {
        return;
      }
    }

    await this._chatRepo.create({
      chatId: uuidV4(),
      type: data.type,
      participants: data.participants,
      projectId: data.projectId,
      name: data.name,
      description: data.description,
      icon: data.icon,
      createdAt: new Date(),
    });
  }
}
