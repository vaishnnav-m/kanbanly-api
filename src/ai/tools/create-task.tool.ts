import * as z from "zod";
import { inject, injectable } from "tsyringe";
import { ToolPayloadDto } from "../../types/dtos/ai/ai.dto";
import { ITaskService } from "../../types/service-interface/ITaskService";
import {
  TaskPriority,
  TaskStatus,
  WorkItemType,
} from "../../types/dtos/task/task.dto";
import { tool } from "langchain";
import logger from "../../logger/winston.logger";
import {
  formatToolErrorForUser,
  MISSING_PROJECT_CONTEXT_ERROR,
} from "../utils/tool-error-message";

@injectable()
export class CreateTaskTool {
  constructor(@inject("ITaskService") private _taskService: ITaskService) {}

  build({ userId, workspaceId, projectId }: ToolPayloadDto) {
    const schema = z.object({
      task: z.string().min(3).describe("Short title of the task"),
      description: z.string().optional().describe("Detailed description"),
      priority: z.enum(TaskPriority).describe("Task priority"),
      status: z.enum(TaskStatus).optional().describe("Initial status"),
      workItemType: z.enum(WorkItemType).describe("Type of work item"),
      dueDate: z.iso.datetime().optional().describe("Due date"),
      storyPoint: z.number().int().min(1).optional().describe("Story points"),
    });

    return tool(
      async ({
        task,
        workItemType,
        description,
        dueDate,
        priority,
        status,
      }) => {
        try {
          if (!projectId) {
            throw new Error(MISSING_PROJECT_CONTEXT_ERROR);
          }

          await this._taskService.createTask({
            workspaceId,
            projectId,
            task,
            workItemType,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority,
            status,
            createdBy: userId,
          });

          return `✅ Task "${task}" created successfully.`;
        } catch (error) {
          logger.error("create_task tool failed", {
            error,
            task,
            workspaceId,
            projectId,
          });
          return formatToolErrorForUser("create_task", error, { task });
        }
      },
      {
        name: "create_task",
        description:
          "Creates a new task in a project. Use when the user asks to add, create, or assign a task.",
        schema,
      }
    );
  }
}
