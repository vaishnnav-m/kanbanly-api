import { IMessage } from "../entities/IMessage";
import { IBaseRepository } from "./IBaseRepositroy";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMessageRepository extends IBaseRepository<IMessage> {}
