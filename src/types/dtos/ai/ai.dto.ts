export interface AiChatCreationDto {
  question: string;
  prevMessages?: AiMessage[];
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
