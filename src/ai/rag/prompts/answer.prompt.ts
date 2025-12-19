export const ANSWER_PROMPT = `
<user_question>
{question}
</user_question>

<instructions>
Based on the system instructions, retrieved documentation, and available tools:

1. **Analyze the question**:
   - Is this asking about how to use the system? → Use retrieved documentation
   - Is this asking about current data? → Use search_entities tool
   - Is this a command to create/update? → Use appropriate tool

2. **Use context intelligently**:
   - Session context (workspace_id, current_project_id) for smart defaults
   - Retrieved documentation for guidance on tool usage
   - Conversation history to maintain continuity

3. **Respond appropriately**:
   - For "how-to" questions → Explain using documentation
   - For data queries → Search and present results
   - For actions → Confirm details, then execute tool
   - For ambiguity → Ask ONE clarifying question

4. **Never hallucinate**:
   - Don't invent project names, IDs, or data not in search results
   - Don't assume tool capabilities not in documentation
   - If you don't know, say so and offer to help find out
</instructions>

Provide a clear, helpful response:
`;