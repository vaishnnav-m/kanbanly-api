import { injectable } from "tsyringe";
import { commentModel } from "../models/comment.model";
import { IComment } from "../types/entities/ICommnet";
import { ICommentRepository } from "../types/repository-interfaces/ICommentRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor() {
    super(commentModel);
  }

  async getCommentsWithAuthor(
    workspaceId: string,
    taskId: string,
    limit: number,
    skip: number,
    commentId?: string
  ): Promise<IComment[]> {
    const result = await this.model.aggregate([
      { $match: { taskId, ...(commentId && { commentId }) } },
      {
        $lookup: {
          from: "workspacemembers",
          let: { author: "$author" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$author"] },
                    { $eq: ["$workspaceId", workspaceId] },
                  ],
                },
              },
            },
          ],
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return result;
  }
}
