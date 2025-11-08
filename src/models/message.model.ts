import { model, Schema } from "mongoose";
import { IMessage } from "../types/entities/IMessage";

const messageSchema = new Schema<IMessage>({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  readBy: {
    type: [String],
  },
  text: {
    type: String,
    required: true,
  },
  replyTo: {
    type: String,
  },
});

export const messageModel = model("message", messageSchema);
