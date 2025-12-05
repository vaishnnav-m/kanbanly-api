import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import {
  CreateMessageDto,
  MessageResponseDto,
} from "../types/dtos/message/message.dto";
import { IMessageService } from "../types/service-interface/IMessageService";
import { IMessageRepository } from "../types/repository-interfaces/IMessageRepository";
import { IChatRepository } from "../types/repository-interfaces/IChatRepository";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { INotificationService } from "../types/service-interface/INotificationService";
import { IUserService } from "../types/service-interface/IUserService";
import { UserDataResponseDto } from "../types/dtos/users/user-response.dto";
import { IUser } from "../types/entities/IUser";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject("IMessageRepository") private _messageRepo: IMessageRepository,
    @inject("IChatRepository") private _chatRepo: IChatRepository,
    @inject("INotificationService")
    private _notificationService: INotificationService,
    @inject("IUserService") private _userService: IUserService
  ) {}

  async createMessage(data: CreateMessageDto): Promise<void> {
    const chat = await this._chatRepo.findOne({ chatId: data.chatId });
    if (!chat) {
      throw new AppError(
        ERROR_MESSAGES.CHAT_ID_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let directUser: UserDataResponseDto | null = null;

    if (chat.type === "direct") {
      const otherUserId = chat.participants.find((id) => id !== data.senderId);
      if (otherUserId) {
        directUser = await this._userService.getUserData(otherUserId);
      }
    }

    const newMessage = {
      messageId: uuidV4(),
      chatId: data.chatId,
      text: data.text,
      senderId: data.senderId,
    };

    await this._messageRepo.create(newMessage);

    const members = chat.participants;

    const receivers = members.filter((id) => id !== data.senderId);

    for (const receiverId of receivers) {
      let title = "";

      if (chat.type === "project") {
        title = `New message in ${chat.name}`;
      } else if (chat.type === "direct") {
        title = `New message from ${directUser?.firstName ?? "Someone"}`;
      }

      await this._notificationService.createNotification({
        userId: receiverId,
        title,
        message:
          data.text.length > 50
            ? data.text.substring(0, 50) + "..."
            : data.text,
      });
    }
  }

  async getChatMessages(chatId: string): Promise<MessageResponseDto[]> {
    const chat = await this._chatRepo.findOne({ chatId });
    if (!chat) {
      throw new AppError(
        ERROR_MESSAGES.CHAT_ID_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const messages = await this._messageRepo.getMessages(chatId);
    const mappedMessages = messages.map((message) => {
      const sender = message.senderId as IUser;
      return {
        chatId: message.chatId,
        text: message.text,
        sender: {
          userId: sender.userId,
          name: sender.firstName,
          email: sender.email,
          profile: sender.profile,
        },
        createdAt: message.createdAt,
      };
    });

    return mappedMessages;
  }
}
