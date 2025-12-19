import { BaseRetriever } from "@langchain/core/retrievers";

export interface IKnowledgeBaseService {
  initialize(): Promise<void>;
  retrieve(query: string): Promise<string>;
  getRetriever(): BaseRetriever;
}
