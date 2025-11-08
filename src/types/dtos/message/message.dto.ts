export interface CreateMessageDto {
  chatId: string;
  text: string;
  senderId: string;
  readBy?: string;
  replyTo?: string[];
}
