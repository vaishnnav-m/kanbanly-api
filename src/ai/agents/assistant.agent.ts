import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../../config";
import { IKnowledgeBaseService } from "../../types/ai/IKnowledgeBaseService";
import { inject, injectable } from "tsyringe";
import logger from "../../logger/winston.logger";
import { createTools } from "../tools";
import { createAgent, HumanMessage } from "langchain";
import { SYSTEM_PROMPT } from "../rag/prompts/system.prompt";

interface AgentInput {
  question: string;
  userId: string;
  workspaceId: string;
  currentProjectId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastMentioned?: Record<string, any>;
}

@injectable()
export class AssistantAgent {
  private _model: ChatGoogleGenerativeAI;

  constructor(
    @inject("IKnowledgeBaseService")
    private _knowledgeBase: IKnowledgeBaseService
  ) {
    this._model = new ChatGoogleGenerativeAI({
      model: config.ai.model,
      apiKey: config.ai.GOOGLE_API_KEY,
      temperature: config.ai.temperature,
    });
  }

  async run(input: AgentInput): Promise<string> {
    try {
      const tools = createTools(
        input.workspaceId,
        input.userId,
        this._knowledgeBase
      );

      const formattedSystemPrompt = SYSTEM_PROMPT.replace(
        "{workspace_id}",
        input.workspaceId
      )
        .replace("{current_project_id}", input.currentProjectId || "None")
        .replace("{last_mentioned}", JSON.stringify(input.lastMentioned || {}));

      const agent = createAgent({
        model: this._model,
        tools,
        systemPrompt: formattedSystemPrompt,
      });

      const result = await agent.invoke({
        messages: [new HumanMessage(input.question)],
      });

      const lastMessage = result.messages[result.messages.length - 1];
      return lastMessage.content as string;
    } catch (error) {
      logger.error("[AssistantAgent] Error:", error);
      return "";
    }
  }
}
