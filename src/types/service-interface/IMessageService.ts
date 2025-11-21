import {
  CreateMessageDto,
  MessageResponseDto,
} from "../dtos/message/message.dto";

export interface IMessageService {
  createMessage(data: CreateMessageDto): Promise<void>;
  getChatMessages(chatId: string): Promise<MessageResponseDto[]>;
}
