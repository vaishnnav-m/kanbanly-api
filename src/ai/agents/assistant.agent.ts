import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../../config";
import { inject, injectable } from "tsyringe";
import logger from "../../logger/winston.logger";
import { AIMessage, createAgent, HumanMessage } from "langchain";
import { SYSTEM_PROMPT } from "../rag/prompts/system.prompt";
import { AiMessage } from "../../types/dtos/ai/ai.dto";
import { ToolFactory } from "../tools";

interface AgentInput {
  question: string;
  userId: string;
  workspaceId: string;
  currentProjectId?: string;
  lastMessages?: AiMessage[];
}

@injectable()
export class AssistantAgent {
  private _model: ChatGoogleGenerativeAI;

  constructor(
    @inject(ToolFactory)
    private _toolFactory: ToolFactory
  ) {
    this._model = new ChatGoogleGenerativeAI({
      model: config.ai.model,
      apiKey: config.ai.GOOGLE_API_KEY,
      temperature: config.ai.temperature,
    });
  }

  async run(input: AgentInput): Promise<string> {
    try {
      const tools = this._toolFactory.build({
        workspaceId: input.workspaceId,
        userId: input.userId,
        projectId: input.currentProjectId,
      });

      const formattedSystemPrompt = SYSTEM_PROMPT.replace(
        "{workspace_id}",
        input.workspaceId
      )
        .replace("{current_project_id}", input.currentProjectId || "None")
        .replace("{last_mentioned}", JSON.stringify({}));

      const agent = createAgent({
        model: this._model,
        tools,
        systemPrompt: formattedSystemPrompt,
      });

      const messages = [];
      if (input.lastMessages) {
        const lastMessages = [];
        if (input.lastMessages.length > 5) {
          lastMessages.push(...input.lastMessages.slice(-4));
        } else {
          lastMessages.push(...input.lastMessages);
        }

        messages.push(
          ...lastMessages.map((m) =>
            m.role === "user"
              ? new HumanMessage(m.content)
              : new AIMessage(m.content)
          )
        );
      }

      messages.push(new HumanMessage(input.question));

      const result = await agent.invoke({
        messages,
      });

      const lastMessage = result.messages[result.messages.length - 1];
      return lastMessage.content as string;
    } catch (error) {
      logger.error("[AssistaHumanMessagentAgent] Error:", error);
      return "";
    }
  }
}
