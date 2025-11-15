import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { CreateMessageDto } from "../types/dtos/message/message.dto";
import { IMessageService } from "../types/service-interface/IMessageService";
import { IMessageRepository } from "../types/repository-interfaces/IMessageRepository";
import { IChatRepository } from "../types/repository-interfaces/IChatRepository";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject("IMessageRepository") private _messageRepo: IMessageRepository,
    @inject("IChatRepository") private _chatRepo: IChatRepository
  ) {}

  async createMessage(data: CreateMessageDto): Promise<void> {
    const chat = await this._chatRepo.findOne({ chatId: data.chatId });
    if (!chat) {
      throw new AppError(
        ERROR_MESSAGES.CHAT_ID_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const newMessage = {
      messageId: uuidV4(),
      chatId: data.chatId,
      text: data.text,
      senderId: data.senderId,
    };

    await this._messageRepo.create(newMessage);
  }

  async getChatMessages(chatId: string): Promise<void> {

  }
}
