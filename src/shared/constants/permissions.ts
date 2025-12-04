import { WorkspacePermission } from "../../types/enums/workspace-permissions.enum";

export const DEFAULT_WORKSPACE_PERMISSIONS = {
  owner: {
    [WorkspacePermission.WORKSPACE_MANAGE]: true,

    [WorkspacePermission.PROJECT_CREATE]: true,
    [WorkspacePermission.PROJECT_EDIT]: true,
    [WorkspacePermission.PROJECT_DELETE]: true,
    [WorkspacePermission.PROJECT_MEMBER_ADD]: true,
    [WorkspacePermission.PROJECT_MEMBER_DELETE]: true,

    [WorkspacePermission.TASK_CREATE]: true,
    [WorkspacePermission.TASK_EDIT]: true,
    [WorkspacePermission.TASK_DELETE]: true,
    [WorkspacePermission.TASK_ASSIGN]: true,
  },

  projectManager: {
    [WorkspacePermission.WORKSPACE_MANAGE]: false,

    [WorkspacePermission.PROJECT_CREATE]: true,
    [WorkspacePermission.PROJECT_EDIT]: true,
    [WorkspacePermission.PROJECT_DELETE]: false,
    [WorkspacePermission.PROJECT_MEMBER_ADD]: true,
    [WorkspacePermission.PROJECT_MEMBER_DELETE]: true,

    [WorkspacePermission.TASK_CREATE]: true,
    [WorkspacePermission.TASK_EDIT]: true,
    [WorkspacePermission.TASK_DELETE]: false,
    [WorkspacePermission.TASK_ASSIGN]: true,
  },

  member: {
    [WorkspacePermission.WORKSPACE_MANAGE]: false,

    [WorkspacePermission.PROJECT_CREATE]: false,
    [WorkspacePermission.PROJECT_EDIT]: false,
    [WorkspacePermission.PROJECT_DELETE]: false,
    [WorkspacePermission.PROJECT_MEMBER_ADD]: false,
    [WorkspacePermission.PROJECT_MEMBER_DELETE]: false,

    [WorkspacePermission.TASK_CREATE]: true,
    [WorkspacePermission.TASK_EDIT]: false,
    [WorkspacePermission.TASK_DELETE]: false,
    [WorkspacePermission.TASK_ASSIGN]: false,
  },
};
