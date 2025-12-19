export interface IAiService {
  processUserQuery(
    userId: string,
    workspaceId: string,
    question: string,
    context: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lastMentioned?: any;
      currentProjectId?: string;
    }
  ): Promise<string>;
}
