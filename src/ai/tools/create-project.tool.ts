import * as z from "zod";
import { tool } from "langchain";
import { inject, injectable } from "tsyringe";
import logger from "../../logger/winston.logger";
import { ProjectTemplateEnum } from "../../types/enums/project-template.enum";
import { IProjectService } from "../../types/service-interface/IProjectService";

@injectable()
export class CreateProjectTool {
  constructor(
    @inject("IProjectService") private _projectService: IProjectService
  ) {}

  build({ userId, workspaceId }: { userId: string; workspaceId: string }) {
    const schema = z.object({
      name: z.string().min(3).describe("Name of the project"),
      description: z
        .string()
        .optional()
        .describe("Optional project description"),
      template: z
        .enum(ProjectTemplateEnum)
        .describe("Project template (scrum or kanban)"),
    });

    return tool(
      async ({ name, description, template }) => {
        try {
          const key = name
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^A-Za-z0-9-]/g, "")
            .toUpperCase();

          await this._projectService.addProject({
            workspaceId,
            name,
            description: description ?? "",
            createdBy: userId,
            key,
            template,
          });

          return `✅ Project "${name}" created using ${template} template.`;
        } catch (error) {
          logger.error(`An error occured in the create project tool`, error);
        }
      },
      {
        name: "create_project",
        description:
          "Creates a new project in the current workspace. Use when the user asks to create a project.",
        schema,
      }
    );
  }
}
