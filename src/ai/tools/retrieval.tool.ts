import { tool } from "langchain";
import { IKnowledgeBaseService } from "../../types/ai/IKnowledgeBaseService";
import * as z from "zod";

// export const createRetrievalTool = (knowledgeBase: IKnowledgeBaseService) => {
//   const schema = z.object({
//     query: z.string().describe("The search query for documentation"),
//   });

//   return new DynamicStructuredTool({
//     name: "search_documentation",
//     description:
//       "Searches the documentation for how-to guides, best practices, and system capabilities. Returns relevant documentation content that can help answer questions.",
//     schema,
//     func: async (input: z.infer<typeof schema>) => {
//       try {
//         const context = await knowledgeBase.retrieve(input.query);

//         if (!context || context.trim().length === 0) {
//           return "No relevant documentation found for this query.";
//         }

//         const formattedResponse = RETRIEVAL_PROMPT.replace(
//           "{context}",
//           context
//         );

//         return formattedResponse;
//       } catch (error) {
//         logger.error("[RetrievalTool] Error:", error);
//         return "Error retrieving documentation. Please try again.";
//       }
//     },
//   });
// };

export const createRetrievalTool = (knowledgeBase: IKnowledgeBaseService) => {
  const schema = z.object({
    query: z.string().describe("The search query for documentation"),
  });

  return tool(
    async ({ query }) => {
      const context = await knowledgeBase.retrieve(query);

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
};
