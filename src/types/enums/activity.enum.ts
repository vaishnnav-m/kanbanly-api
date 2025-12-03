export enum ActivityTypeEnum {
  Task = "task",
  Project = "project",
  Sprint = "sprint",
  Comment = "comment",
}

export enum TaskActivityActionEnum {
  TaskCreated = "task_created",
  TaskUpdated = "task_updated",
  StatusChanged = "status_changed",
  Commented = "commented",
  ParentAttached = "parent_attached",
  TaskAssigned = "task_assigned",
  CommentEdited = "comment_edited",
  CommentDeleted = "comment_deleted",
  ParentDetached = "parent_detached",
}
