import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { ICommentService } from "../types/service-interface/ICommentService";
import { ICommentRepository } from "../types/repository-interfaces/ICommentRepository";
import {
  CommentAuthor,
  CommentResponseDto,
  CreateCommentDto,
} from "../types/dtos/comment/comment.dto";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject("ICommentRepository") private _commentRepo: ICommentRepository
  ) {}

  async createComment(data: CreateCommentDto): Promise<void> {
    const comment = {
      commentId: uuidV4(),
      author: data.author,
      taskId: data.taskId,
      content: data.content,
    };

    await this._commentRepo.create(comment);
  }

  async getAllComments(
    workspaceId: string,
    taskId: string,
    page: number
  ): Promise<CommentResponseDto[]> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const comments = await this._commentRepo.getCommentsWithAuthor(
      workspaceId,
      taskId,
      limit,
      skip
    );

    console.log("comments", comments);

    const mappedComments = comments.map(
      (comment): CommentResponseDto => ({
        commentId: comment.commentId,
        taskId: comment.taskId,
        author: comment.author as CommentAuthor,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })
    );

    return mappedComments;
  }
}
