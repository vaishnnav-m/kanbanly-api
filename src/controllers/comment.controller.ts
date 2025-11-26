import { inject, injectable } from "tsyringe";
import { ICommentController } from "../types/controller-interfaces/ICommentController";
import { ICommentService } from "../types/service-interface/ICommentService";
import { Request, Response } from "express";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { CreateCommentDto } from "../types/dtos/comment/comment.dto";

@injectable()
export class CommentController implements ICommentController {
  constructor(
    @inject("ICommentService") private _commentService: ICommentService
  ) {}

  async createComment(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = req.body as Omit<CreateCommentDto, "authorId" | "taskId">;
    const taskId = req.params.taskId;

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._commentService.createComment({
      author: user.userid,
      content: data.content,
      taskId,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }
}
