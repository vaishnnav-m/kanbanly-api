export interface CreateChatDto {
  type: "direct" | "project";
  workspaceId: string;
  participants: string[];
  projectId?: string;
  name?: string;
  description?: string;
  icon?: string;
}

export interface ChatListingDto {
  chatId: string;
  name: string;
  type: "direct" | "project";
  icon?: string;
}

export interface ChatDetailsDto {
  chatId: string;
  name: string;
  type: "direct" | "project";
  icon?: string;
  description?: string;
  createdAt: string;
}
