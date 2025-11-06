import { model, Schema } from "mongoose";
import { IChat } from "../types/entities/IChat";

const chatSchema = new Schema<IChat>(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
    },
    projectId: {
      type: String,
    },
    participants: {
      type: [String],
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const chatModel = model("chat", chatSchema);
