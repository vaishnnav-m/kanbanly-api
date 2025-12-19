import { inject, injectable } from "tsyringe";
import { IAiService } from "../types/service-interface/IAiService";
import { AssistantAgent } from "../ai/agents/assistant.agent";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lastMentioned?: any;
      currentProjectId?: string;
    }
  ): Promise<string> {
    const response = await this._assistantAgent.run({
      question,
      userId,
      workspaceId,
      currentProjectId: context.currentProjectId,
      lastMentioned: context.lastMentioned,
    });

    return response;
  }
}
