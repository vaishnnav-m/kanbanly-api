import {
  CommentAuthor,
  TiptapNode,
} from "../dtos/comment/comment.dto";

export interface IComment {
  commentId: string;
  author: string | CommentAuthor;
  taskId: string;
  content: TiptapNode;
  createdAt: Date;
  updatedAt: Date;
}
