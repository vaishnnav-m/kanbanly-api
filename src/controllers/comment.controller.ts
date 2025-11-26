import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ICommentController } from "../types/controller-interfaces/ICommentController";
import { ICommentService } from "../types/service-interface/ICommentService";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { TiptapNode } from "../types/dtos/comment/comment.dto";

@injectable()
export class CommentController implements ICommentController {
  constructor(
    @inject("ICommentService") private _commentService: ICommentService
  ) {}

  async createComment(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = req.body as { content: TiptapNode };
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

  async getAllComments(req: Request, res: Response): Promise<void> {
    const params = req.params as {
      workspaceId: string;
      projectId: string;
      taskId: string;
    };
    const page = Number(req.query.page) || 0;

    const comments = await this._commentService.getAllComments(
      params.workspaceId,
      params.taskId,
      page
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: comments,
    });
  }

  async editComment(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = req.body as { content: TiptapNode };
    const taskId = req.params.taskId;
    const commentId = req.params.commentId;

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._commentService.editComment({
      commentId,
      taskId,
      author: user.userid,
      content: data.content,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_EDITED });
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const commentId = req.params.commentId;

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._commentService.deleteComment(commentId, user.userid);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_DELETED });
  }
}
