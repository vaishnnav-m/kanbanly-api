import { IChat } from "../entities/IChat";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IChatRepository extends IBaseRepository<IChat> {
  getChats(
    workspaceId: string,
    userId: string,
    chatId?: string
  ): Promise<IChat[]>;
}
