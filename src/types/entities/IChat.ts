export interface IChat {
  chatId: string;
  workspaceId: string;
  type: "direct" | "project";
  participants: string[];
  projectId?: string;
  name?: string;
  description?: string;
  icon?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
