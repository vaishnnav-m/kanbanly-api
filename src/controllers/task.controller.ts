import { inject, injectable } from "tsyringe";
import { ITaskController } from "../types/controller-interfaces/ITaskController";
import { ITaskService } from "../types/service-interface/ITaskService";
import { Request, Response } from "express";
import {
  CreateTaskDto,
  EditTaskDto,
  TaskPriority,
  TaskStatus,
} from "../types/dtos/task/task.dto";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class TaskController implements ITaskController {
  constructor(@inject("ITaskService") private _taskService: ITaskService) {}

  async createTask(req: Request, res: Response) {
    const createdBy = req.user?.userid;
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;

    const { task, description, priority, assignedTo, dueDate } =
      req.body as Omit<CreateTaskDto, "createdBy">;

    if (!createdBy) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._taskService.createTask({
      task,
      description,
      assignedTo,
      createdBy,
      dueDate,
      priority,
      projectId,
      workspaceId,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }

  async getAllTasks(req: Request, res: Response) {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const tasks = await this._taskService.getAllTask(
      workspaceId,
      projectId,
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: tasks,
    });
  }

  async getOneTask(req: Request, res: Response) {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const task = await this._taskService.getOneTask(
      workspaceId,
      projectId,
      userId,
      taskId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: task,
    });
  }

  async changeTaskStatus(req: Request, res: Response) {
    const userId = req.user?.userid;
    const taskId = req.params.taskId;

    const data = req.body as { newStatus: TaskStatus };
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (
      !data?.newStatus ||
      !Object.values(TaskStatus).includes(data.newStatus)
    ) {
      throw new AppError("The status not exists", HTTP_STATUS.BAD_REQUEST);
    }

    await this._taskService.changeTaskStatus(taskId, userId, data.newStatus);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_EDITED });
  }

  async editTask(req: Request, res: Response) {
    const userId = req.user?.userid;
    const taskId = req.params.taskId;
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;

    const data = req.body as Omit<EditTaskDto, "userId" | "taskId">;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (
      data?.priority &&
      !Object.values(TaskPriority).includes(data.priority)
    ) {
      throw new AppError("The priority not exists", HTTP_STATUS.BAD_REQUEST);
    }

    await this._taskService.editTask(workspaceId, projectId, taskId, userId, {
      taskId,
      userId,
      ...data,
    });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_EDITED });
  }

  async removeTask(req: Request, res: Response) {
    const userId = req.user?.userid;
    const workspaceId = req.params.workspaceId;
    const taskId = req.params.taskId;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await this._taskService.removeTask(workspaceId, taskId, userId);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_DELETED });
  }
}
