import { AiMessage } from "../dtos/ai/ai.dto";

export interface IAiService {
  processUserQuery(
    userId: string,
    workspaceId: string,
    question: string,
    context: {
      lastMessages?: AiMessage[];
      currentProjectId?: string;
    }
  ): Promise<string>;
}
