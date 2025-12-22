import { inject, injectable } from "tsyringe";
import { IAiService } from "../types/service-interface/IAiService";
import { AssistantAgent } from "../ai/agents/assistant.agent";
import { AiMessage } from "../types/dtos/ai/ai.dto";

@injectable()
export class AiService implements IAiService {
  constructor(
    @inject(AssistantAgent) private _assistantAgent: AssistantAgent
  ) {}

  async processUserQuery(
    userId: string,
    workspaceId: string,
    question: string,
    context: {
      lastMessages?: AiMessage[];
      currentProjectId?: string;
    }
  ): Promise<string> {
    const response = await this._assistantAgent.run({
      question,
      userId,
      workspaceId,
      currentProjectId: context.currentProjectId,
      lastMessages: context.lastMessages,
    });

    return response;
  }
}
