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

  async getChats(workspaceId: string, userId: string): Promise<IChat[]> {
    const result = await this.model.aggregate([
      { $match: { workspaceId, participants: { $in: [userId] } } },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ["$type", "direct"] },
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$participants",
                      as: "p",
                      cond: { $ne: ["$$p", userId] },
                    },
                  },
                  0,
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUser",
          foreignField: "userId",
          as: "otherUser",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $addFields: {
          name: {
            $cond: [
              { $eq: ["$type", "direct"] },
              "$otherUser.firstName",
              "name",
            ],
          },
          icon: {
            $cond: [{ $eq: ["$type", "direct"] }, "$otherUser.profile", "icon"],
          },
        },
      },
      {
        $project: {
          chatId: 1,
          type: 1,
          name: 1,
          description: 1,
          icon: 1,
          lastMessage: 1,
          lastMessageAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return result;
  }
}
