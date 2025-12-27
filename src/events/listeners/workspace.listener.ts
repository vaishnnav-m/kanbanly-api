import { container } from "tsyringe";
import { SocketHandler } from "../../socket/socket.handler";
import { AppEvent, appEvents } from "../app.events";
import { IWorkItem } from "../../types/entities/IWorkItem";
import logger from "../../logger/winston.logger";
import { TaskListingDto } from "../../types/dtos/task/task.dto";

export function registerWorkspaceEventListner() {
  const socketHandler = container.resolve(SocketHandler);

  appEvents.on(AppEvent.TaskChange, (task: IWorkItem) => {
    socketHandler.emitToRoom(task.projectId, "taskchange", {
      taskId: task.taskId,
      workspaceId: task.workspaceId,
      task: task.task,
      status: task.status,
      workItemType: task.workItemType,
      priority: task.priority,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      dueDate: task.dueDate,
      sprintId: task.sprintId,
      epic: task.epic,
    } as TaskListingDto);
    
    logger.info(
      `[Event Listener] Task change event is sent to ${task.projectId}`
    );
  });
}
