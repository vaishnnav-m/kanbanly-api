export interface CreateChatDto {
  type: "direct" | "project";
  participants: string[];
  projectId?: string;
  name?: string;
  description?: string;
  icon?: string;
}
