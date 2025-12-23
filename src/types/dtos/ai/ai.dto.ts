export interface AiChatCreationDto {
  question: string;
  prevMessages?: AiMessage[];
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ToolPayloadDto {
  userId: string;
  workspaceId: string;
  projectId?: string;
}
