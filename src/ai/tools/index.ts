import { inject, injectable } from "tsyringe";
import { SearchDocumentationTool } from "./retrieval.tool";
import { CreateProjectTool } from "./create-project.tool";
import { CreateTaskTool } from "./create-task.tool";
import { ToolPayloadDto } from "../../types/dtos/ai/ai.dto";

@injectable()
export class ToolFactory {
  constructor(
    @inject(SearchDocumentationTool)
    private _searchDocTool: SearchDocumentationTool,
    @inject(CreateProjectTool)
    private _createProjectTool: CreateProjectTool,
    private _createTaskTool: CreateTaskTool
  ) {}

  build({ workspaceId, userId, projectId }: ToolPayloadDto) {
    return [
      this._searchDocTool.build(),
      this._createProjectTool.build({ workspaceId, userId }),
      this._createTaskTool.build({ workspaceId, userId, projectId }),
    ];
  }
}
