import { INotification } from "../entities/INotification";
import { IBaseRepository } from "./IBaseRepositroy";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INotificationRepository
  extends IBaseRepository<INotification> {}
