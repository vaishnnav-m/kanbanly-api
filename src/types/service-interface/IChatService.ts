import { CreateChatDto } from "../dtos/chat/chat.dto";

export interface IChatService {
  createChat(data: CreateChatDto): Promise<void>;
}
