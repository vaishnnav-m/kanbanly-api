import { Document } from "langchain";

export const APP_KNOWLEDGE_DOCS = [
  // ============================================================================
  // SECTION 1: APPLICATION OVERVIEW & IDENTITY
  // ============================================================================

  new Document({
    pageContent:
      "Kanbanly is a comprehensive project management tool supporting both Scrum and Kanban methodologies. It provides visual task management through boards, sprint planning for Agile teams, and real-time collaboration features. The application is designed for teams of all sizes to manage projects effectively.",
    metadata: { type: "overview", category: "application", priority: "high" },
  }),

  new Document({
    pageContent:
      "Kanbanly supports two project types: Scrum projects (time-boxed sprints, backlog management, story points, epic management, etc) and Kanban projects (continuous flow, visual boards, no sprints). Users choose the methodology during project creation based on their team's needs.",
    metadata: {
      type: "project-types",
      category: "application",
      priority: "high",
    },
  }),

  // ============================================================================
  // SECTION 2: DATA HIERARCHY & STRUCTURE
  // ============================================================================

  new Document({
    pageContent:
      "Data hierarchy: Workspace → Projects → Epics → Stories → (Tasks | Subtasks). A Workspace is owned by one user and can contain multiple Projects. Users can be members of multiple workspaces and switch between them. Tasks exist independently under Projects. Subtasks exist under Stories and can also be under Tasks.",
    metadata: { type: "hierarchy", category: "data-model", priority: "high" },
  }),

  new Document({
    pageContent:
       "Work items structure: Epics are distinct entities representing large bodies of work. Stories, Tasks, Bugs, Features, and Subtasks are all 'Work Items' (sharing the same data structure) distinguished by their 'workItemType'. Stories often sit within Epics. Tasks can exist independently or be linked to Epics.",
    metadata: { type: "work-items", category: "data-model", priority: "high" },
  }),

  new Document({
    pageContent:
      "Relationships: One Workspace has many Projects. One Project has many Epics and many Tasks (independent). One Epic has many Stories. One Story can have many Subtasks. One Task can have many Subtasks. Tasks are NOT under Stories - they exist at Project level. Subtasks can belong to either Stories or Tasks.",
    metadata: {
      type: "relationships",
      category: "data-model",
      priority: "high",
    },
  }),

  // ============================================================================
  // SECTION 3: WORKSPACE & ORGANIZATION
  // ============================================================================

  new Document({
    pageContent:
      "Workspace properties: name (required), description (optional), owner (single user who created it), created date. Users can create multiple workspaces and switch between them. Each workspace has its own members, projects, and settings.",
    metadata: { type: "workspace", category: "organization", priority: "high" },
  }),

  new Document({
    pageContent:
      "Workspace member management: Owner can invite members via email. Invitations have three statuses: pending, accepted, rejected. Invited users receive email with accept/decline links. Invitations expire after 7 days. Owner can block/unblock members. Owner can assign roles to members.",
    metadata: {
      type: "workspace-members",
      category: "organization",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Subscription plans: Free (1 workspace, 5 projects, 10 members, basic features), Pro (unlimited workspaces/projects, 50 members, advanced features like analytics), Enterprise (unlimited everything, SSO, dedicated support, custom integrations). Billing handled via Stripe/Razorpay. Plan limits are enforced per workspace.",
    metadata: {
      type: "subscriptions",
      category: "billing",
      priority: "medium",
    },
  }),

  // ============================================================================
  // SECTION 4: USER ROLES & PERMISSIONS
  // ============================================================================

  new Document({
    pageContent:
      "User roles in Kanbanly: Owner (full workspace control, billing, invite/remove members, assign roles, delete workspace, configure custom permissions), Project Manager (create/edit/delete projects, manage sprints, create epics/stories/tasks, assign tasks), Member (view assigned projects, create/edit own tasks, comment, update task status). Role names may be customized by the Owner.",
    metadata: { type: "roles", category: "permissions", priority: "high" },
  }),

  new Document({
    pageContent:
      "Dynamic permissions: The Owner can customize permissions for each role beyond the defaults. Before suggesting any action, the AI must consider the current user's role and any custom permissions that may have been set by the workspace Owner. Always check if user has permission before performing actions.",
    metadata: {
      type: "dynamic-permissions",
      category: "permissions",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Permission matrix defaults: Create Workspace (Owner only), Invite Members (Owner, PM with permission), Create Project (Owner, PM), Delete Project (Owner, PM), Create Epic (Owner, PM), Create Story (Owner, PM, Member with permission), Create Task (all roles), Delete Task (Owner, PM, task creator), Assign Task (Owner, PM), Start Sprint (Owner, PM). Note: Owner can modify these defaults.",
    metadata: {
      type: "permission-matrix",
      category: "permissions",
      priority: "high",
    },
  }),

  // ============================================================================
  // SECTION 5: PROJECT MANAGEMENT
  // ============================================================================

  new Document({
    pageContent:
      "Project properties: name (required), description (required for AI generation), type (Scrum or Kanban, required), assigned members (optional), status (Active/On Hold/Completed/Archived), created by, created date. Access to projects is based on membership.",
    metadata: {
      type: "project-properties",
      category: "projects",
      priority: "high",
    },
  }),



  new Document({
    pageContent:
      "Project filtering: Users can filter projects by status (Active/On Hold/Completed/Archived), assigned members, date ranges. Search functionality available for project names and descriptions.",
    metadata: {
      type: "project-filtering",
      category: "projects",
      priority: "low",
    },
  }),

  // ============================================================================
  // SECTION 6: SCRUM METHODOLOGY
  // ============================================================================

  new Document({
    pageContent:
      "Scrum projects in Kanbanly: Use time-boxed sprints (1-4 weeks typical), have backlog for unscheduled work, use story points for estimation, track sprint progress. Sprints have states: Planning (created, adding stories), Active (started, team working), Completed (ended, review done).",
    metadata: { type: "scrum-overview", category: "scrum", priority: "high" },
  }),

  new Document({
    pageContent:
      "Sprint properties: name (required, e.g., 'Sprint 1'), start date (required), end date (required), goal (optional sprint objective). Only one active sprint per project at a time. Cannot delete sprint once started.",
    metadata: {
      type: "sprint-properties",
      category: "scrum",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Backlog management: The backlog contains all unscheduled Stories and Tasks. Items are prioritized and groomed regularly. During sprint planning, items move from backlog to sprint. Backlog should be continuously refined with acceptance criteria, story points, and clear descriptions.",
    metadata: { type: "backlog", category: "scrum", priority: "high" },
  }),

  new Document({
    pageContent:
      "Story points in Kanbanly: Used for relative estimation of effort and complexity. Recommended scale is Fibonacci sequence (1, 2, 3, 5, 8, 13, 21). Story points are assigned to Stories, not Tasks. Used for sprint planning and capacity estimation. 1 point = very simple (<2 hours), 3 points = moderate (4-8 hours), 5 points = complex (1-2 days), 8 points = very complex (2-3 days), 13+ points = needs breakdown.",
    metadata: { type: "story-points", category: "scrum", priority: "high" },
  }),

  new Document({
    pageContent:
      "Note: Kanbanly does NOT currently have automatic velocity calculation or capacity tracking. These must be calculated manually by the team based on completed story points per sprint. The AI should not reference automated velocity/capacity features.",
    metadata: {
      type: "scrum-limitations",
      category: "scrum",
      priority: "high",
    },
  }),

  // ============================================================================
  // SECTION 7: KANBAN METHODOLOGY
  // ============================================================================

  new Document({
    pageContent:
      "Kanban projects in Kanbanly: Focus on continuous flow without sprints. Use visual boards with columns representing workflow stages. Can have WIP (Work In Progress) limits per column. No story points or backlog management. Emphasis on visualizing work and limiting work in progress.",
    metadata: { type: "kanban-overview", category: "kanban", priority: "high" },
  }),

  new Document({
    pageContent:
      "Kanban board columns: Default columns are To Do, In Progress, Completed. WIP limits can be set per column to prevent bottlenecks. Users drag and drop tasks between columns to update status.",
    metadata: { type: "kanban-boards", category: "kanban", priority: "high" },
  }),

  // ============================================================================
  // SECTION 8: EPICS, STORIES, TASKS
  // ============================================================================

  new Document({
    pageContent:
      "Epic properties: title (required), description (required), project (required), status (Not Started/In Progress/Completed), assigned to (optional), due date (optional). Epics are large bodies of work that span multiple sprints and contain multiple Stories.",
    metadata: {
      type: "epic-properties",
      category: "work-items",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Story properties (Work Item type 'story'): title (required, stored as 'task'), description (user story format recommended), epic (optional parent), story points (for Scrum projects), status (To Do/In Progress/Completed), assignee (optional), priority (Low/Medium/High), due date (optional).",
    metadata: {
      type: "story-properties",
      category: "work-items",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
       "Task properties (Work Item type 'task'): title (required, stored as 'task'), description (optional). Can be children of epics. Subtasks can be children of tasks or stories.",
    metadata: {
      type: "task-properties",
      category: "work-items",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "IMPORTANT: Tasks in Kanbanly have NO tags or labels feature. Do not suggest or reference tags/labels for tasks. Only status, priority, and assignment are available for task organization. Use priority levels and clear naming conventions instead.",
    metadata: {
      type: "task-limitations",
      category: "work-items",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Subtask properties: title (required), description (optional), parent task (required), status (To Do/In Progress/Completed), assignee (optional), due date (optional). Subtasks are the smallest actionable units under Tasks. Check system maximum nesting depth.",
    metadata: {
      type: "subtask-properties",
      category: "work-items",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Task status transitions: To Do → In Progress (when work starts), In Progress → Completed (when finished), In Progress → To Do (if work paused), Completed → In Progress (if reopened, check if allowed). Tasks can only be in one of these three states. Status updates trigger notifications to assignees.",
    metadata: {
      type: "task-statuses",
      category: "work-items",
      priority: "high",
    },
  }),

  // ============================================================================
  // SECTION 9: BOARD MANAGEMENT
  // ============================================================================

  new Document({
    pageContent:
      "Board functionality: Boards organize tasks into columns representing workflow stages. Default columns: To Do, In Progress, Completed. Users can drag and drop tasks between columns to update status. Each project has at least one board. Boards support custom column configuration.",
    metadata: { type: "boards", category: "features", priority: "high" },
  }),

  new Document({
    pageContent:
      "Board views: Kanbanly provides board view (visual kanban style), list view (table format), and calendar view (tasks by due date). Users can switch between views based on preference. View preference can be set in user settings.",
    metadata: { type: "board-views", category: "features", priority: "medium" },
  }),

  // ============================================================================
  // SECTION 10: COLLABORATION FEATURES
  // ============================================================================

  new Document({
    pageContent:
      "Real-time collaboration: Powered by Socket.IO for live updates. Users see real-time changes when team members move tasks, add comments, or make updates. Online presence shows who's currently viewing the same board. Changes appear instantly without page refresh.",
    metadata: {
      type: "real-time",
      category: "collaboration",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Comments functionality: Users can add comments to Projects, Epics, Stories, and Tasks. Comments support rich text formatting, @mentions for notifying specific users, and file attachments. Comments can be edited or deleted by the author. Threaded under the work item.",
    metadata: { type: "comments", category: "collaboration", priority: "high" },
  }),

  new Document({
    pageContent:
      "Mentions system: Format is @username. When user is mentioned in a comment, they receive both in-app and email notification (based on preferences). Multiple users can be mentioned in one comment. Only workspace members can be mentioned.",
    metadata: {
      type: "mentions",
      category: "collaboration",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Chat feature: Real-time chat within projects for team communication. Chat messages are separate from task comments. Supports direct messages and group discussions. Chat history is preserved. Powered by Socket.IO for instant delivery.",
    metadata: { type: "chat", category: "collaboration", priority: "medium" },
  }),

  // ============================================================================
  // SECTION 11: NOTIFICATIONS & ACTIVITY
  // ============================================================================

  new Document({
    pageContent:
      "Notification triggers: Task assigned to you, mentioned in comment (@user), task status changed (if assignee), due date approaching (configurable days before), sprint starting/ending, new comment on task you're watching, invitation to workspace, task priority changed.",
    metadata: {
      type: "notification-triggers",
      category: "notifications",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Notification channels: In-app notifications (real-time badge, notification center), Email notifications (based on user preferences). Users can configure per notification type in settings: instant, daily digest, or never. Notification preferences are per-user, not per-workspace.",
    metadata: {
      type: "notification-channels",
      category: "notifications",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Activity feed: Tracks all activities with user, timestamp, and action details. Tracked activities include: project created/updated/deleted, task created/updated/deleted/assigned, status changed, sprint started/completed, comment added, member invited/joined, due date changed. Provides audit trail for transparency.",
    metadata: {
      type: "activity-feed",
      category: "notifications",
      priority: "medium",
    },
  }),

  // ============================================================================
  // SECTION 12: ANALYTICS & REPORTING
  // ============================================================================

  new Document({
    pageContent:
      "Analytics dashboard: Available in Pro and Enterprise plans. Provides workspace summary, project progress metrics, task completion rates, team performance over time, individual contributor statistics. Helps identify bottlenecks and track team productivity.",
    metadata: { type: "analytics", category: "features", priority: "medium" },
  }),

  new Document({
    pageContent:
      "Sprint reports (Scrum only): Burndown charts showing remaining work over sprint, burnup charts showing completed work, sprint completion rate, story points completed vs planned. Note: Velocity tracking is manual, not automated in current version.",
    metadata: {
      type: "sprint-reports",
      category: "features",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Task analytics: Time tracking summaries (estimated vs actual hours), task age (how long tasks stay in each status), completion trends over time, overdue task tracking, assignment distribution across team members.",
    metadata: { type: "task-analytics", category: "features", priority: "low" },
  }),

  // ============================================================================
  // SECTION 13: USER PREFERENCES & SETTINGS
  // ============================================================================

  new Document({
    pageContent:
      "User profile settings: Name, email (verified), password reset, avatar upload, timezone, date format, language preference. Profile information is shared across all workspaces the user is a member of.",
    metadata: { type: "profile", category: "settings", priority: "low" },
  }),

  new Document({
    pageContent:
      "User preferences: Theme (light/dark/system auto), default project view (board/list/calendar), notification settings (email/in-app toggles per type), email digest frequency (instant/daily/weekly/never), working hours for due date reminders.",
    metadata: { type: "preferences", category: "settings", priority: "low" },
  }),

  // ============================================================================
  // SECTION 14: AUTHENTICATION & SECURITY
  // ============================================================================

  new Document({
    pageContent:
      "Authentication: User registration with email verification required. Login via email/password or Google social login. Password reset via email link. JWT token system for session management. Tokens expire after configured duration for security.",
    metadata: { type: "authentication", category: "security", priority: "low" },
  }),

  new Document({
    pageContent:
      "Role-based access control: Permissions enforced per workspace. Users can have different roles in different workspaces. All API endpoints check user permissions before allowing actions. Unauthorized actions are blocked with appropriate error messages.",
    metadata: {
      type: "authorization",
      category: "security",
      priority: "medium",
    },
  }),

  // ============================================================================
  // SECTION 15: AI ASSISTANT CAPABILITIES
  // ============================================================================

  new Document({
    pageContent:
      "AI Assistant can perform these actions: Create projects with auto-generated Epics and Stories based on description, Create individual Epics/Stories/Tasks from natural language, Assign tasks to team members (with permission check), Update task statuses, Generate sprint reports and summaries, Provide project insights and recommendations, Answer questions about Kanbanly features and data, Suggest task breakdowns for Epics, Help with sprint planning.",
    metadata: { type: "ai-capabilities", category: "ai", priority: "high" },
  }),

  new Document({
    pageContent:
      "AI Assistant CANNOT: Delete any items (projects, tasks, etc.), Change project methodology after creation, Modify team members or permissions, Access admin-only features, Calculate automated velocity (must be done manually), Override permission restrictions, Create items if user lacks permission, Perform bulk operations without explicit user confirmation.",
    metadata: { type: "ai-limitations", category: "ai", priority: "high" },
  }),

  new Document({
    pageContent:
      "AI confirmation requirements: ALWAYS ask for user confirmation before: Creating a project, Creating 3+ epics at once, Creating 5+ stories at once, Starting a sprint, Assigning tasks to other users, Any bulk operation, Changing important settings. Show preview of what will be created with counts and structure.",
    metadata: { type: "ai-confirmation", category: "ai", priority: "high" },
  }),

  new Document({
    pageContent:
      "AI project analysis: When user requests project creation, AI analyzes description to: Identify project type/domain, Extract key features and requirements, Group related features into logical Epics, Suggest appropriate methodology (Scrum vs Kanban), Generate well-structured Stories with acceptance criteria, Recommend priority and story point estimates.",
    metadata: { type: "ai-project-analysis", category: "ai", priority: "high" },
  }),

  new Document({
    pageContent:
      "AI methodology recommendation: Suggest Scrum for: projects with defined phases, evolving requirements, product development, need for regular planning ceremonies, team size 3-9 members. Suggest Kanban for: continuous delivery needs, maintenance/support work, frequently changing priorities, operational tasks, highly variable work items. Always ask user to confirm the suggestion.",
    metadata: { type: "ai-methodology", category: "ai", priority: "high" },
  }),

  // ============================================================================
  // SECTION 16: COMMON PROJECT TEMPLATES
  // ============================================================================

  new Document({
    pageContent:
      "E-commerce Website template Epics: 1) User Authentication & Account Management (registration, login, profile, password reset), 2) Product Catalog & Search (listing, search, filters, categories, product details, reviews), 3) Shopping Cart & Checkout (add to cart, cart management, checkout flow, payment integration), 4) Order Management (order tracking, history, invoice, returns), 5) Admin Panel (product/order/user management, analytics, inventory).",
    metadata: {
      type: "template-ecommerce",
      category: "templates",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Mobile App template Epics: 1) User Onboarding (splash screen, registration, tutorial, profile setup), 2) Core Features (based on app purpose), 3) User Profile & Settings (profile editing, preferences, notification settings), 4) Backend Integration (API integration, data sync, offline mode, caching), 5) Push Notifications (setup, scheduling, user preferences), 6) Social Features (if applicable: sharing, social login, feeds).",
    metadata: {
      type: "template-mobile",
      category: "templates",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Web Application template Epics: 1) User Authentication & Authorization, 2) Dashboard & Analytics, 3) Core Functionality (specific to app purpose), 4) User Management & Settings, 5) Reporting & Exports, 6) Integrations & APIs. Customize based on specific web app type.",
    metadata: {
      type: "template-webapp",
      category: "templates",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Marketing Campaign template Epics: 1) Campaign Strategy & Planning (goals, audience, budget, timeline), 2) Content Creation (copywriting, design assets, video production), 3) Channel Execution (social media, email, paid ads, SEO), 4) Analytics & Reporting (tracking setup, performance monitoring, ROI analysis), 5) Optimization & A/B Testing.",
    metadata: {
      type: "template-marketing",
      category: "templates",
      priority: "low",
    },
  }),

  // ============================================================================
  // SECTION 17: BEST PRACTICES & GUIDANCE
  // ============================================================================

  new Document({
    pageContent:
      "Writing effective user stories: Use format 'As a [user type], I want [goal], so that [benefit]'. Include clear acceptance criteria (Given-When-Then format). Keep stories small enough to complete in one sprint. Ensure stories are independent, negotiable, valuable, estimable, small, and testable (INVEST criteria). Example: 'As a customer, I want to reset my password via email, so that I can regain access if I forget it.'",
    metadata: {
      type: "story-writing",
      category: "best-practices",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Sprint planning best practices: Review and groom backlog before planning. Consider team capacity (aim for 80% to allow buffer). Break down large stories (13+ points). Identify dependencies and risks. Set clear sprint goal. Don't overcommit in early sprints. Use past sprint data to estimate capacity (if available).",
    metadata: {
      type: "sprint-planning",
      category: "best-practices",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Task breakdown guidelines: Break Epics into 3-7 Stories. Break Stories into 2-5 Tasks. Keep Tasks focused on single responsibility. Subtasks should take less than 4 hours. If Story is 13+ points, break it down further. Ensure all work is captured but not over-specified initially.",
    metadata: {
      type: "task-breakdown",
      category: "best-practices",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Backlog grooming: Conduct regular grooming sessions (weekly/bi-weekly). Remove outdated items. Add detail to upcoming stories. Re-prioritize based on business value. Estimate new items. Identify and document dependencies. Keep top items refined and ready for sprint planning.",
    metadata: {
      type: "backlog-grooming",
      category: "best-practices",
      priority: "low",
    },
  }),

  // ============================================================================
  // SECTION 18: ERROR HANDLING & EDGE CASES
  // ============================================================================

  new Document({
    pageContent:
      "Permission errors: When user lacks permission, explain what permission is needed and who can grant it. Suggest: 1) Request permission from workspace Owner, 2) Ask Project Manager for help, 3) Offer alternative actions user CAN perform. Never apologize for security restrictions, frame as protecting workspace integrity.",
    metadata: {
      type: "permission-errors",
      category: "error-handling",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Plan limit errors: When workspace hits plan limits (projects, members, storage), explain current plan and limits. Suggest: 1) Archive/delete existing items, 2) Upgrade to higher plan tier, 3) Show current usage. Be helpful, not pushy about upgrades.",
    metadata: {
      type: "plan-limits",
      category: "error-handling",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Sprint conflicts: Cannot start new sprint while another is active. Suggest: 1) Wait for current sprint to complete, 2) Complete current sprint early (if possible), 3) View current sprint details. Cannot add stories to active sprint in most cases - clarify your system's rule on this.",
    metadata: {
      type: "sprint-conflicts",
      category: "error-handling",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Assignment errors: Cannot assign task to user not in workspace. Suggest: 1) Invite user to workspace first, 2) Assign to different team member, 3) Leave unassigned. Only workspace members can be assigned tasks.",
    metadata: {
      type: "assignment-errors",
      category: "error-handling",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Ambiguous requests: When project description is too vague, ask clarifying questions: 1) What is the main goal?, 2) Who are the end users?, 3) Any timeline or deadline?, 4) What type of work is involved?, 5) Will requirements change frequently? Gather enough context before generating structure.",
    metadata: {
      type: "ambiguous-requests",
      category: "error-handling",
      priority: "high",
    },
  }),

  // ============================================================================
  // SECTION 19: AI RESPONSE PATTERNS
  // ============================================================================

  new Document({
    pageContent:
      "AI tone and personality: Be helpful, professional, and encouraging. Use clear, concise language. Avoid jargon unless necessary. Be proactive in offering next steps. Show enthusiasm for user's projects. Frame limitations positively. Use emojis sparingly for visual clarity (📋 for tasks, 📦 for epics, 🚀 for sprints). Be conversational but professional.",
    metadata: { type: "ai-tone", category: "ai-behavior", priority: "high" },
  }),

  new Document({
    pageContent:
      "Confirmation message format: Clearly state what will be created with counts. Use visual hierarchy (emojis, line breaks). List key items being created. Ask explicit yes/no question. Offer modification option. Example: 'I'll create: 📦 3 Epics, 📋 12 Stories. Scrum project, 2-week sprints. Proceed? (Yes/No/Modify)'",
    metadata: {
      type: "confirmation-format",
      category: "ai-behavior",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Handling feature questions: Explain feature clearly and concisely. Provide navigation path if relevant ('Go to Projects > Settings > Privacy'). Offer to help user use the feature. Include relevant tips or best practices. If feature doesn't exist, suggest workaround or acknowledge limitation honestly.",
    metadata: {
      type: "feature-questions",
      category: "ai-behavior",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Methodology guidance: When asked about Scrum vs Kanban, explain both clearly. Provide decision criteria based on their context. Give examples relevant to their project type. Make a recommendation with reasoning. Always defer to user's preference. Offer to explain either methodology in detail if needed.",
    metadata: {
      type: "methodology-guidance",
      category: "ai-behavior",
      priority: "medium",
    },
  }),

  // ============================================================================
  // SECTION 20: SYSTEM CONSTRAINTS & TECHNICAL DETAILS
  // ============================================================================

  new Document({
    pageContent:
      "Field validations: Project name and description are required. Task title is required (description optional). Epic title and description required. Story title required. User email must be valid format. Due dates cannot be in the past (confirm your rule). Story points must be positive integers from approved scale. Assignee must be workspace member.",
    metadata: {
      type: "validations",
      category: "technical",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "System limitations: Only three task statuses (To Do, In Progress, Completed). No automated velocity calculation. No tags/labels for tasks. One assignee per task. One active sprint per project. Subtask nesting depth limit (specify your limit). Plan-based feature restrictions (Free/Pro/Enterprise).",
    metadata: { type: "limitations", category: "technical", priority: "high" },
  }),

  new Document({
    pageContent:
      "Attachment support: Comments support file attachments. Attachment size limit per file (specify your limit). Total storage per workspace based on plan. Supported file types (specify: images, PDFs, documents, etc.). Attachments are scanned for security.",
    metadata: { type: "attachments", category: "technical", priority: "low" },
  }),

  // ============================================================================
  // SECTION 21: ADMIN FUNCTIONALITY (INTERNAL USE ONLY)
  // ============================================================================

  new Document({
    pageContent:
      "INTERNAL ADMIN CONTEXT (DO NOT SHARE WITH USERS): Admin panel allows: viewing all workspaces, sales statistics, managing subscription plans (create/update/delete), viewing revenue metrics, user blocking at system level, system-wide settings. Regular users should never know these capabilities exist.",
    metadata: { type: "admin-internal", category: "admin", priority: "high" },
  }),

  // ============================================================================
  // SECTION 22: QUICK REFERENCE
  // ============================================================================

  new Document({
    pageContent:
      "Terminology glossary: Workspace (top-level organization unit), Epic (large body of work, multiple sprints), Story (user-facing feature, one sprint), Task (specific work item, assignable unit), Subtask (smallest unit under task), Sprint (time-boxed iteration for Scrum), Backlog (unscheduled work repository), Story Points (relative effort estimate), Velocity (average points per sprint, manual tracking), Board (visual workflow representation), WIP Limit (max items per column).",
    metadata: { type: "glossary", category: "reference", priority: "medium" },
  }),

  new Document({
    pageContent:
      "Common user request patterns: 'Create project for...' (needs description), 'Add task to...' (needs project/epic context), 'What's the status of...' (query specific item), 'Who's working on...' (assignment query), 'Start sprint' (needs sprint setup), 'Show me...' (display request), 'Help with...' (guidance request), 'Plan sprint' (sprint planning assistance), 'Break down...' (epic/story decomposition).",
    metadata: {
      type: "user-patterns",
      category: "reference",
      priority: "medium",
    },
  }),

  // ============================================================================
  // SECTION 23: CONTEXT-AWARE RESPONSES
  // ============================================================================

  new Document({
    pageContent:
      "Context awareness: AI should track current conversation context including: active workspace user is discussing, current project in focus, user's role in workspace, recent actions taken, items just created. Use context to provide relevant follow-up suggestions without requiring user to repeat information.",
    metadata: {
      type: "context-awareness",
      category: "ai-behavior",
      priority: "high",
    },
  }),

  new Document({
    pageContent:
      "Follow-up suggestions: After creating project, suggest: reviewing backlog, planning first sprint, inviting team members. After starting sprint, suggest: daily standup reminders, progress tracking. After completing sprint, suggest: sprint review, retrospective, velocity calculation. Provide actionable next steps.",
    metadata: {
      type: "follow-ups",
      category: "ai-behavior",
      priority: "medium",
    },
  }),

  new Document({
    pageContent:
      "Multi-turn conversations: AI should remember earlier parts of conversation. If user says 'add 3 more stories', AI should know which project/epic from context. If user says 'assign that to John', AI should know which task. Maintain conversation state for better UX.",
    metadata: {
      type: "conversation-memory",
      category: "ai-behavior",
      priority: "high",
    },
  }),
];
