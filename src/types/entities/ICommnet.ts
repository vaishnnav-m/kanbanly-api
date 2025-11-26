// /* eslint-disable @typescript-eslint/no-explicit-any */
// export interface CustomTiptapNode {
//   type: string;
//   attrs?: Record<string, any>;
//   content?: CustomTiptapNode[];
//   marks?: { type: string; attrs?: Record<string, any> }[];
//   text?: string;
// }

import { CommentAuthor } from "../dtos/comment/comment.dto";

// interface CustomTiptapContent {
//   type: string;
//   content?: CustomTiptapNode[];
//   attrs?: Record<string, any>;
// }

export interface IComment {
  commentId: string;
  author: string | CommentAuthor;
  taskId: string;
  content: object;
  createdAt: Date;
  updatedAt: Date;
}
