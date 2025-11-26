/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  attrs?: Record<string, any>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
  text?: string;
}

export interface Mention {
  id: string;
  label: string;
}

export interface CreateCommentDto {
  author: string;
  taskId: string;
  content: TiptapNode;
}

export interface EditCommentDto {
  commentId: string;
  author: string;
  taskId: string;
  content: TiptapNode;
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
  content: TiptapNode;
  createdAt: Date;
  updatedAt?: Date;
}
