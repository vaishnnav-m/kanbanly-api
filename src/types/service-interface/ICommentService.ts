import { CreateCommentDto } from "../dtos/comment/comment.dto";

export interface ICommentService {
  createComment(data: CreateCommentDto): Promise<void>;
}
