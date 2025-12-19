import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { config } from "../../../config";
import { SYSTEM_PROMPT } from "../prompts/system.prompt";
import { ANSWER_PROMPT } from "../prompts/answer.prompt";

interface AnswerChainInput {
  question: string;
  workspaceId: string;
  currentProjectId?: string;
  lastMentioned?: Record<string, any>;
  context?: string;
}

export class AnswerChain {
  private _llm: ChatGoogleGenerativeAI;
  private prompt: ChatPromptTemplate;

  constructor() {
    this._llm = new ChatGoogleGenerativeAI({
      model: config.ai.model,
      apiKey: config.ai.GOOGLE_API_KEY,
      temperature: config.ai.temperature,
    });

    this.prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT],
      ["human", ANSWER_PROMPT],
    ]);
  }

  async run(input: AnswerChainInput): Promise<string> {
    const messages = await this.prompt.formatMessages({
      question: input.question,

      workspaceId: input.workspaceId,
      currentProjectId: input.currentProjectId ?? "None",
      lastMentioned: JSON.stringify(input.lastMentioned ?? {}),

      context: input.context ?? "No additional context available.",
    });

    const response = await this._llm.invoke(messages);

    return response.toFormattedString();
  }
}
