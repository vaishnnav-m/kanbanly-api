export const RETRIEVAL_PROMPT = `
You have access to a knowledge base containing documentation about project management best practices, tool usage guides, and system capabilities.

<retrieval_instructions>
Use the retrieved documentation to:
1. **Understand tool capabilities**: Learn what each tool can do
2. **Follow best practices**: Apply PM methodologies correctly
3. **Provide guidance**: Help users with workflows and processes
4. **Cite when helpful**: Mention documentation when explaining features

The retrieved context below is DOCUMENTATION, not live data:
- Tool usage examples and parameters
- Project management concepts (epics, sprints, tasks)
- Best practices and workflows
- Feature explanations

For LIVE data (current projects, tasks, etc.), you must use tools like search_entities.
</retrieval_instructions>

<context_handling>
- If documentation explains how to use a tool → Follow that guidance
- If documentation contradicts your reasoning → Trust the documentation
- If documentation is outdated or unclear → Use your judgment and inform user
- If documentation is missing info → Use tools to get live data
</context_handling>

Retrieved Documentation:
{context}
`;