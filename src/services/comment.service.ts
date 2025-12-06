import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { ICommentService } from "../types/service-interface/ICommentService";
import { ICommentRepository } from "../types/repository-interfaces/ICommentRepository";
import {
  CommentResponseDto,
  CreateCommentDto,
  EditCommentDto,
  Mention,
  TiptapNode,
} from "../types/dtos/comment/comment.dto";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IPreferenceService } from "../types/service-interface/IPreferenceService";
import { IEmailService } from "../types/service-interface/IEmailService";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import { IUserService } from "../types/service-interface/IUserService";
import { IActivityService } from "../types/service-interface/IActivityService";
import { CreateActivityDto } from "../types/dtos/activity/activity.dto";
import {
  ActivityTypeEnum,
  TaskActivityActionEnum,
} from "../types/enums/activity.enum";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject("ICommentRepository") private _commentRepo: ICommentRepository,
    @inject("IPreferenceService")
    private _preferenseService: IPreferenceService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IWorkItemRepository") private _taskRepo: IWorkItemRepository,
    @inject("IUserService") private _userService: IUserService,
    @inject("IActivityService") private _activityService: IActivityService
  ) {}

  private _extractMentions(content: TiptapNode): Mention[] {
    const mentions: Mention[] = [];

    function traverse(node: TiptapNode) {
      if (node.type === "mention" && node.attrs) {
        mentions.push({
          id: node.attrs.id,
          label: node.attrs.label || node.attrs.id,
        });
      }

      if (node.marks) {
        node.marks.forEach((mark) => {
          if (mark.type === "mention" && mark.attrs) {
            mentions.push({
              id: mark.attrs.id,
              label: mark.attrs.label || mark.attrs.id,
            });
          }
        });
      }

      if (node.content) {
        node.content.forEach(traverse);
      }
    }

    traverse(content);

    return Array.from(new Map(mentions.map((m) => [m.id, m])).values());
  }

  async createComment(data: CreateCommentDto): Promise<void> {
    const taskArray = await this._taskRepo.getTasksWithAssigness({
      taskId: data.taskId,
    });
    const task = taskArray[0];

    if (!task) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const comment = {
      commentId: uuidV4(),
      author: data.author,
      taskId: data.taskId,
      content: data.content,
    };

    const mentions = this._extractMentions(data.content);
    const author = await this._userService.getUserData(data.author);
    if (mentions.length) {
      for (const mention of mentions) {
        const mentionedUser = await this._userService.getUserData(mention.id);

        if (!mentionedUser) continue;

        const userPreference = await this._preferenseService.getUserPreferences(
          mention.id
        );

        if (!userPreference?.mention?.email) {
          continue;
        }

        await this._emailService.sendMentionEmail(
          mentionedUser.email,
          author.firstName,
          task.task
        );
      }
    }

    await this._commentRepo.create(comment);

    const activitylogPayload: CreateActivityDto = {
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      taskId: task.taskId,
      entityId: task.taskId,
      entityType: ActivityTypeEnum.Task,
      action: TaskActivityActionEnum.Commented,
      description: `${author.firstName} commented on this ${task.workItemType}`,
      member: data.author,
    };

    await this._activityService.createActivity(activitylogPayload);
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

    const mappedComments = comments.map((comment): CommentResponseDto => {
      const author = comment.author as IWorkspaceMember;
      return {
        commentId: comment.commentId,
        taskId: comment.taskId,
        author: {
          userId: author.userId,
          name: author.name,
          role: author.role,
          profile: author.profile,
        },
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });

    return mappedComments;
  }

  async editComment(data: EditCommentDto): Promise<void> {
    const comment = await this._commentRepo.findOne({
      commentId: data.commentId,
    });
    if (!comment || (comment.author as string) !== data.author) {
      throw new AppError(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._commentRepo.update(
      {
        commentId: data.commentId,
        taskId: data.taskId,
      },
      { content: data.content }
    );
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this._commentRepo.findOne({
      commentId,
    });
    if (!comment || (comment.author as string) !== userId) {
      throw new AppError(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._commentRepo.delete({ commentId });
  }
}
