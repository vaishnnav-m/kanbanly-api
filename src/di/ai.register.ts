import { container } from "tsyringe";
import { IKnowledgeBaseService } from "../types/ai/IKnowledgeBaseService";
import { KnowledgeBaseService } from "../ai/rag/knowledge/knowledgeBaseService";
import { SearchDocumentationTool } from "../ai/tools/retrieval.tool";
import { CreateProjectTool } from "../ai/tools/create-project.tool";
import { ToolFactory } from "../ai/tools";
import { CreateTaskTool } from "../ai/tools/create-task.tool";

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
    container.register(CreateTaskTool, {
      useClass: CreateTaskTool,
    });
    container.register(ToolFactory, {
      useClass: ToolFactory,
    });
  }
}
