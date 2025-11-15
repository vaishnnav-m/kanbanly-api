import {
  ChatDetailsDto,
  ChatListingDto,
  CreateChatDto,
} from "../dtos/chat/chat.dto";

export interface IChatService {
  createChat(data: CreateChatDto): Promise<void>;
  getUserChats(userId: string, workspaceId: string): Promise<ChatListingDto[]>;
  getOneChat(
    userId: string,
    workspaceId: string,
    chatId: string
  ): Promise<ChatDetailsDto>;
}
