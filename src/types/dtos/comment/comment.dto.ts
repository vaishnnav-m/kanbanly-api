export interface CreateCommentDto {
  author: string;
  taskId: string;
  content: object;
}

export interface CommentAuthor {
  userId: string;
  name: string;
  role: string;
  profile?: string;
}

export interface CommentResponseDto {
  commentId: string;
  author: CommentAuthor;
  taskId: string;
  content: object;
  createdAt: Date;
  updatedAt?: Date;
}
