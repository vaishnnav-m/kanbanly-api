import { messageModel } from "../models/message.model";
import { IMessage } from "../types/entities/IMessage";
import { IMessageRepository } from "../types/repository-interfaces/IMessageRepository";
import { BaseRepository } from "./base.repository";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(messageModel);
  }
}
