// /* eslint-disable @typescript-eslint/no-explicit-any */
// export interface CustomTiptapNode {
//   type: string;
//   attrs?: Record<string, any>;
//   content?: CustomTiptapNode[];
//   marks?: { type: string; attrs?: Record<string, any> }[];
//   text?: string;
// }

// interface CustomTiptapContent {
//   type: string;
//   content?: CustomTiptapNode[];
//   attrs?: Record<string, any>;
// }

export interface IComment {
  commentId: string;
  author: string;
  taskId: string;
  content: object;
  createdAt: Date;
  updatedAt: Date;
}
