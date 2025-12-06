import { WorkspacePermission } from "../../types/enums/workspace-permissions.enum";

export const DEFAULT_WORKSPACE_PERMISSIONS = {
  owner: {
    // Workspace
    [WorkspacePermission.WORKSPACE_EDIT]: true,
    [WorkspacePermission.WORKSPACE_MEMBER_ADD]: true,
    [WorkspacePermission.WORKSPACE_MEMBER_DELETE]: true,

    // Project
    [WorkspacePermission.PROJECT_CREATE]: true,
    [WorkspacePermission.PROJECT_EDIT]: true,
    [WorkspacePermission.PROJECT_DELETE]: true,
    [WorkspacePermission.PROJECT_MEMBER_ADD]: true,
    [WorkspacePermission.PROJECT_MEMBER_DELETE]: true,

    // Task
    [WorkspacePermission.TASK_CREATE]: true,
    [WorkspacePermission.TASK_EDIT]: true,
    [WorkspacePermission.TASK_DELETE]: true,
    [WorkspacePermission.TASK_ASSIGN]: true,

    // Epic
    [WorkspacePermission.EPIC_CREATE]: true,
    [WorkspacePermission.EPIC_EDIT]: true,
    [WorkspacePermission.EPIC_DELETE]: true,

    // Sprint
    [WorkspacePermission.SPRINT_CREATE]: true,
    [WorkspacePermission.SPRINT_EDIT]: true,
    [WorkspacePermission.SPRINT_DELETE]: true,
  },

  projectManager: {
    // Workspace
    [WorkspacePermission.WORKSPACE_EDIT]: false,
    [WorkspacePermission.WORKSPACE_MEMBER_ADD]: false,
    [WorkspacePermission.WORKSPACE_MEMBER_DELETE]: false,

    // Project
    [WorkspacePermission.PROJECT_CREATE]: true,
    [WorkspacePermission.PROJECT_EDIT]: true,
    [WorkspacePermission.PROJECT_DELETE]: false,
    [WorkspacePermission.PROJECT_MEMBER_ADD]: true,
    [WorkspacePermission.PROJECT_MEMBER_DELETE]: true,

    // Task
    [WorkspacePermission.TASK_CREATE]: true,
    [WorkspacePermission.TASK_EDIT]: true,
    [WorkspacePermission.TASK_DELETE]: false,
    [WorkspacePermission.TASK_ASSIGN]: true,

    // Epic
    [WorkspacePermission.EPIC_CREATE]: true,
    [WorkspacePermission.EPIC_EDIT]: true,
    [WorkspacePermission.EPIC_DELETE]: false,

    // Sprint
    [WorkspacePermission.SPRINT_CREATE]: true,
    [WorkspacePermission.SPRINT_EDIT]: true,
    [WorkspacePermission.SPRINT_DELETE]: false,
  },

  member: {
    // Workspace
    [WorkspacePermission.WORKSPACE_EDIT]: false,
    [WorkspacePermission.WORKSPACE_MEMBER_ADD]: false,
    [WorkspacePermission.WORKSPACE_MEMBER_DELETE]: false,

    // Project
    [WorkspacePermission.PROJECT_CREATE]: false,
    [WorkspacePermission.PROJECT_EDIT]: false,
    [WorkspacePermission.PROJECT_DELETE]: false,
    [WorkspacePermission.PROJECT_MEMBER_ADD]: false,
    [WorkspacePermission.PROJECT_MEMBER_DELETE]: false,

    // Task
    [WorkspacePermission.TASK_CREATE]: true,
    [WorkspacePermission.TASK_EDIT]: false,
    [WorkspacePermission.TASK_DELETE]: false,
    [WorkspacePermission.TASK_ASSIGN]: false,

    // Epic
    [WorkspacePermission.EPIC_CREATE]: false,
    [WorkspacePermission.EPIC_EDIT]: false,
    [WorkspacePermission.EPIC_DELETE]: false,

    // Sprint
    [WorkspacePermission.SPRINT_CREATE]: false,
    [WorkspacePermission.SPRINT_EDIT]: false,
    [WorkspacePermission.SPRINT_DELETE]: false,
  },
};
