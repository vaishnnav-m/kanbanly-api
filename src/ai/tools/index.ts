import { IKnowledgeBaseService } from "../../types/ai/IKnowledgeBaseService";
import { createRetrievalTool } from "./retrieval.tool";

export const createTools = (
  workspaceId: string,
  userId: string,
  knowledgeBase: IKnowledgeBaseService
) => {
  return [createRetrievalTool(knowledgeBase)];
};
