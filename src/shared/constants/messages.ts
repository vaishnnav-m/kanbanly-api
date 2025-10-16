export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESSFUL: "User registered successfully.",
  LOGIN_SUCCESSFUL: "User logged in successfully.",
  DATA_FETCHED: "Data fetched successfully.",
  DATA_CREATED: "Data Created Successfully",
  DATA_EDITED: "Data Updated Successfully",
  DATA_DELETED: "Data Deleted Successfully",
  USER_UPDATED: "User updated successfully.",
  USER_LOGOUT: "User logout successfully.",
  ADMIN_LOGOUT: "Admin logout successfully.",
  EMAIL_SEND: "Email send successfully",
  FORGOT_EMAIL_SEND:
    "If an account with that email address exists, a password reset link has been sent to your inbox. Please check your spam folder if you don't see it.",
  EMAIL_VERIFIED: "Email verification was successfull",
  PROJECT_CREATED: "Project Created Successfully",
  MEMBER_ADDED: "Member added successfully",
  MEMBER_REMOVED: "Member successfully removed",
  // SPRINT
  SPRINT_STARTED: "Sprint is now active! Time to get to work. Good luck, team!",
};

export const ERROR_MESSAGES = {
  // GENERAL
  UNEXPECTED_SERVER_ERROR: "An unexpected server error occurred.",
  INPUT_VALIDATION_FAILED: "Input validation failed. Please check your data.",
  EMAIL_ALREADY_EXISTS: "A user with this email already exists.",
  USER_NOT_FOUND: "User not found.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  RESOURCE_NOT_FOUND: "The requested resource was not found.",
  RESOURCE_ALREADY_EXISTS: "The resource already exists.",
  UNAUTHORIZED_ACCESS: "Unauthorized: Missing information",
  FORBIDDEN_ACCESS: "Forbidden access.",
  AUTH_NO_TOKEN_PROVIDED: "Access Denied: No authentication token provided.",
  AUTH_INVALID_TOKEN: "Access Denied: Invalid or expired authentication token.",
  AUTH_TOKEN_ERROR: "Authentication error: Could not process token.",
  DELETE_YOURSELF: "You cannot remove yourself",

  // USER
  USER_NOT_EXIST_OR_ALREADY_VERIFIED: "User not exists or already verified.",
  USER_BLOCKED:
    "Oops! It looks like your access has been restricted. Please reach out to our support team for assistance.",

  // WORKSPACE
  WORKSPACE_NOT_FOUND: "The workspace is not exists",
  WORKSPACE_ALREADY_EXISTS: "The workspace already exists",
  WORKSPACE_LIMIT_EXCEED:
    "Workspace limit exceeded.Upgrade the plan to continue",

  // WORKSPACE MEMBER
  NOT_OWNER: "You are not the owner of this workspace",
  NOT_MEMBER: "You are not a member of this workspace",
  ACTION_DENIED:
    "Action denied: your role does not have the required permissions.",
  MEMBER_NOT_FOUND: "The member is not found",
  INSUFFICIENT_PERMISSION: "Insufficient permission",
  ALREADY_MEMBER: "The member already exists",

  // PROJECT
  PROJECT_ALREADY_EXISTS: "Project with this name already exists",
  PROJECT_NOT_FOUND:
    "Invalid project or project doesn't belong to the specified workspace",
  PROJECT_LIMIT_EXCEED:
    "Project limit in a workspace exceeded.Upgrade the plan to continue",

  // TASK
  TASK_NOT_FOUND: "The task not found",

  // INVITATION
  EXPIRED_LINK: "The link has expired",

  // PLAN
  PLAN_NOT_EXISTS: "Plan not found",

  // SUBSCRIPTION
  ACTIVE_SUBSCRIPTION: "User already have an active subscription",

  // EPIC
  EPIC_ALREADY_EXISTS: "An epic of the same name exists",
  EPIC_NOT_FOUND: "The epic not found",

  // SPRINT
  SPRINT_ALREADY_EXISTS: "A sprint of the same name exists",
  SPRINT_NOT_EXISTS: "Sprint not found",
  SPRINT_EXISTS_TASK: "The task is already a part of a sprint",
  ACTIVE_SPRINT_EXISTS: "Another sprint is already active.",
  EMPTY_SPRINT:
    "This sprint is empty. Please add issues from the backlog before starting.",
  NO_ACTIVE_SPRINT: "There are no active sprints",
};
