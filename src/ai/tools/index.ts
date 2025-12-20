import { inject, injectable } from "tsyringe";
import { SearchDocumentationTool } from "./retrieval.tool";
import { CreateProjectTool } from "./create-project.tool";

@injectable()
export class ToolFactory {
  constructor(
    @inject(SearchDocumentationTool)
    private _searchDocTool: SearchDocumentationTool,
    @inject(CreateProjectTool)
    private _createProjectTool: CreateProjectTool
  ) {}

  build(workspaceId: string, userId: string) {
    return [
      this._searchDocTool.build(),
      this._createProjectTool.build({ workspaceId, userId }),
    ];
  }
}
