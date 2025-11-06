export interface IChat {
  chatId: string;
  type: "direct" | "project";
  participants: string[];
  projectId?: string;
  name?: string;
  description?: string;
  icon?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
