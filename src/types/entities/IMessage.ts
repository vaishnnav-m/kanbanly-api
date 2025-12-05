import { IUser } from "./IUser";

export interface IMessage {
  messageId: string;
  chatId: string;
  senderId: string | IUser;
  text: string;
  //   for future if i enable attachments
  //   attachments?: [
  //     {
  //       url: string;
  //       type: "image" | "file" | "video";
  //       name?: string;
  //       size?: number;
  //     }
  //   ];
  readBy?: string[];
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
