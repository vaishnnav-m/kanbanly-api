import {
  CommentResponseDto,
  CreateCommentDto,
} from "../dtos/comment/comment.dto";

export interface ICommentService {
  createComment(data: CreateCommentDto): Promise<void>;
  getAllComments(
    workspaceId: string,
    taskId: string,
    page: number
  ): Promise<CommentResponseDto[]>;
}
