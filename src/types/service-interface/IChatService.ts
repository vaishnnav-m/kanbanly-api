import {
  ChatDetailsDto,
  ChatListingDto,
  CreateChatDto,
} from "../dtos/chat/chat.dto";

export interface IChatService {
  createChat(data: CreateChatDto): Promise<{ chatId: string } | undefined>;
  getUserChats(userId: string, workspaceId: string): Promise<ChatListingDto[]>;
  getOneChat(
    userId: string,
    workspaceId: string,
    chatId: string
  ): Promise<ChatDetailsDto>;
  addMember(
    projectId: string,
    userId: string,
    memberId: string
  ): Promise<void>;
   removeMember(
    projectId: string,
    userId: string,
    memberId: string
  ): Promise<void>;
}
