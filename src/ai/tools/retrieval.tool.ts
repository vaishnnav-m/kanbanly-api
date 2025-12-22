import * as z from "zod";
import { tool } from "langchain";
import { IKnowledgeBaseService } from "../../types/ai/IKnowledgeBaseService";
import { inject, injectable } from "tsyringe";

@injectable()
export class SearchDocumentationTool {
  constructor(
    @inject("IKnowledgeBaseService")
    private _knowledgeBase: IKnowledgeBaseService
  ) {}

  build() {
    const schema = z.object({
      query: z.string().describe("The search query for documentation"),
    });

    return tool(
      async ({ query }) => {
        const context = await this._knowledgeBase.retrieve(query);

        if (!context || context.trim().length === 0) {
          return "No relevant documentation found for this query.";
        }

        return context;
      },
      {
        name: "search_documentation",
        description:
          "Searches documentation for guides and system capabilities. Use for 'how-to' questions.",
        schema,
      }
    );
  }
}
