import { container } from "tsyringe";
import { IKnowledgeBaseService } from "../types/ai/IKnowledgeBaseService";
import { KnowledgeBaseService } from "../ai/rag/knowledge/knowledgeBaseService";

export class AiRegistry {
  static registerAi(): void {
    container.register<IKnowledgeBaseService>("IKnowledgeBaseService", {
      useClass: KnowledgeBaseService,
    });
  }
}
