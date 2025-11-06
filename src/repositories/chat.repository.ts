import { injectable } from "tsyringe";
import { chatModel } from "../models/chat.model";
import { IChat } from "../types/entities/IChat";
import { IChatRepository } from "../types/repository-interfaces/IChatRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class ChatRepository
  extends BaseRepository<IChat>
  implements IChatRepository
{
  constructor() {
    super(chatModel);
  }
}
