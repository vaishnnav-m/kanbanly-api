import { IMessage } from "../entities/IMessage";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  getMessages(chatId: string): Promise<IMessage[]>;
}
