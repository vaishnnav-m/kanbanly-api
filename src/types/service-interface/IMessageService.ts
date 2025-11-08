import { CreateMessageDto } from "../dtos/message/message.dto";

export interface IMessageService {
  createMessage(data: CreateMessageDto): Promise<void>;
}
