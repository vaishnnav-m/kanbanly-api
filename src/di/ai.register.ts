import { container } from "tsyringe";
import { IKnowledgeBaseService } from "../types/ai/IKnowledgeBaseService";
import { KnowledgeBaseService } from "../ai/rag/knowledge/knowledgeBaseService";
import { SearchDocumentationTool } from "../ai/tools/retrieval.tool";
import { CreateProjectTool } from "../ai/tools/create-project.tool";
import { ToolFactory } from "../ai/tools";

export class AiRegistry {
  static registerAi(): void {
    container.register<IKnowledgeBaseService>("IKnowledgeBaseService", {
      useClass: KnowledgeBaseService,
    });
    container.register(SearchDocumentationTool, {
      useClass: SearchDocumentationTool,
    });
    container.register(CreateProjectTool, {
      useClass: CreateProjectTool,
    });
    container.register(ToolFactory, {
      useClass: ToolFactory,
    });
  }
}
