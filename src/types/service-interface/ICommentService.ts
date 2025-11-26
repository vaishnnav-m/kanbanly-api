import {
  CommentResponseDto,
  CreateCommentDto,
  EditCommentDto,
} from "../dtos/comment/comment.dto";

export interface ICommentService {
  createComment(data: CreateCommentDto): Promise<void>;
  getAllComments(
    workspaceId: string,
    taskId: string,
    page: number
  ): Promise<CommentResponseDto[]>;
  editComment(data: EditCommentDto): Promise<void>;
  deleteComment(commentId: string, userId: string): Promise<void>;
}
