import AppError from "../../shared/utils/AppError";
import { ERROR_MESSAGES } from "../../shared/constants/messages";

export type ToolAction = "create_project" | "create_task";

type ToolErrorContext = {
  name?: string;
  task?: string;
};

const PROJECT_CREATE_MESSAGES: Record<
  string,
  (ctx: ToolErrorContext) => string
> = {
  [ERROR_MESSAGES.INSUFFICIENT_PERMISSION]: () =>
    "You don't have permission to create projects in this workspace. Ask a workspace owner or project manager for help.",
  [ERROR_MESSAGES.PROJECT_LIMIT_EXCEED]: () =>
    "You've reached the project limit on your current plan. Upgrade your plan or remove an unused project, then try again.",
  [ERROR_MESSAGES.PROJECT_ALREADY_EXISTS]: ({ name }) =>
    name
      ? `A project named "${name}" already exists in this workspace. Choose a different name or use the existing project.`
      : "A project with that name already exists in this workspace. Choose a different name.",
  [ERROR_MESSAGES.CHAT_NO_PARTICIPANTS]: () =>
    "The project couldn't be fully set up. Please try again; if the problem continues, create the project from the Projects page.",
};

const TASK_CREATE_MESSAGES: Record<string, (ctx: ToolErrorContext) => string> =
  {
    [ERROR_MESSAGES.INSUFFICIENT_PERMISSION]: () =>
      "You don't have permission to create tasks in this workspace. Ask a workspace owner or project manager for help.",
    [ERROR_MESSAGES.NOT_MEMBER]: () =>
      "You're not a member of this workspace, so tasks can't be created here. Ask to be invited to the workspace first.",
    [ERROR_MESSAGES.PROJECT_NOT_FOUND]: () =>
      "I couldn't find that project in your current workspace. Open the project you want or ask me to search for it by name.",
    [ERROR_MESSAGES.ACTION_DENIED]: () =>
      "Your role doesn't allow creating tasks here. Ask a workspace owner or project manager for access.",
  };

const MISSING_PROJECT_CONTEXT =
  "No project is selected for this chat. Open a project in the app or tell me which project to add the task to.";

const GENERIC_FAILURE =
  "I couldn't complete that action right now. Please try again, or use the app directly if it keeps failing.";

export function formatToolErrorForUser(
  action: ToolAction,
  error: unknown,
  ctx?: ToolErrorContext
): string {
  const prefix = "❌ ";
  const context = ctx ?? {};

  if (error instanceof Error && error.message === MISSING_PROJECT_CONTEXT) {
    return prefix + MISSING_PROJECT_CONTEXT;
  }

  if (error instanceof AppError) {
    const mappers =
      action === "create_project"
        ? PROJECT_CREATE_MESSAGES
        : TASK_CREATE_MESSAGES;
    const mapper = mappers[error.message];
    if (mapper) return prefix + mapper(context);
  }

  if (error instanceof Error && error.message.includes("Project context")) {
    return prefix + MISSING_PROJECT_CONTEXT;
  }

  return prefix + GENERIC_FAILURE;
}

export const MISSING_PROJECT_CONTEXT_ERROR = MISSING_PROJECT_CONTEXT;
