interface AgentInput {
  question: string;
  workspaceId: string;
  currentProjectId?: string;
  lastMentioned?: Record<string, any>;
}

export class AssistantAgent {
  private _agentExecutor: AgentExecutor;
  constructor() {}
}
