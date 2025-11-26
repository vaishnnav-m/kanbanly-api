import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { ICommentService } from "../types/service-interface/ICommentService";
import { ICommentRepository } from "../types/repository-interfaces/ICommentRepository";
import { CreateCommentDto } from "../types/dtos/comment/comment.dto";

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

    console.log("comment is:: ", comment);

    await this._commentRepo.create(comment);
  }
}
