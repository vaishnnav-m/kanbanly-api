export enum WorkspacePermission {
  // Workspace
  WORKSPACE_EDIT = "workspaceEdit",
  WORKSPACE_MEMBER_ADD = "workspaceMemberAdd",
  WORKSPACE_MEMBER_DELETE = "workspaceMemberDelete",

  // Project
  PROJECT_CREATE = "projectCreate",
  PROJECT_EDIT = "projectEdit",
  PROJECT_DELETE = "projectDelete",
  PROJECT_MEMBER_ADD = "projectMemberAdd",
  PROJECT_MEMBER_DELETE = "projectMemberDelete",

  // Task
  TASK_CREATE = "taskCreate",
  TASK_EDIT = "taskEdit",
  TASK_DELETE = "taskDelete",
  TASK_ASSIGN = "taskAssign",

  // Epic
  EPIC_CREATE = "epicCreate",
  EPIC_EDIT = "epicEdit",
  EPIC_DELETE = "epicDelete",

  // Sprint
  SPRINT_CREATE = "sprintCreate",
  SPRINT_EDIT = "sprintEdit",
  SPRINT_DELETE = "sprintDelete",
}
