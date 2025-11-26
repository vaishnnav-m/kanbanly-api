import { model, Schema } from "mongoose";
import { IComment } from "../types/entities/ICommnet";

const commentSchema = new Schema<IComment>(
  {
    commentId: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export const commentModel = model("comment", commentSchema);
