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

  async getMessages(chatId: string): Promise<IMessage[]> {
    const result = await this.model.aggregate([
      {
        $match: { chatId },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "userId",
          as: "senderId",
        },
      },
      {
        $unwind: "$senderId",
      },
      {
        $project: {
          _id: 0,
          messageId: 1,
          chatId: 1,
          text: 1,
          senderId: 1,
          readBy: 1,
          replyTo: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    return result;
  }
}
