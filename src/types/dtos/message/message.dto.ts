export interface CreateMessageDto {
  chatId: string;
  text: string;
  senderId: string;
  readBy?: string;
  replyTo?: string[];
}

export interface MessageResponseDto {
  chatId: string;
  text: string;
  sender: string;
  createdAt: Date;
}
