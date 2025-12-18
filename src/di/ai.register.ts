import { container } from "tsyringe";
import { IKnowledgeRetriever } from "../types/ai/IKnowledgeRetriever";
import { KnowledgeRetriever } from "../ai/rag/knowledge/knowledge.retriever";

export class AiRegistry {
  static registerAi(): void {
    container.register<IKnowledgeRetriever>("IKnowledgeRetriever", {
      useClass: KnowledgeRetriever,
    });
  }
}
