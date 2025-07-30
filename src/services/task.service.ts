import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { ITaskService } from "../types/service-interface/ITaskService";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";
import { CreateTaskDto, TaskStatus } from "../types/dtos/task/task.dto";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { ITask } from "../types/entities/ITask";

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject("ITaskRepository") private _taskRepo: ITaskRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IProjectRepository") private _projectRepo: IProjectRepository
  ) {}

  async createTask(data: CreateTaskDto): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId: data.createdBy,
      workspaceId: data.workspaceId,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    if (
      workspaceMember.role !== workspaceRoles.owner &&
      workspaceMember.role !== workspaceRoles.projectManager
    ) {
      throw new AppError(ERROR_MESSAGES.ACTION_DENIED, HTTP_STATUS.BAD_REQUEST);
    }

    const project = await this._projectRepo.findOne({
      projectId: data.projectId,
    });

    if (!project || project.workspaceId !== data.workspaceId) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_PROJECT_ID,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (data.assignedTo) {
      const assignee = await this._workspaceMemberRepo.findOne({
        userId: data.assignedTo,
        workspaceId: data.workspaceId,
      });
      if (!assignee) {
        throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
      }
    }

    const task: Omit<ITask, "isDeleted"> = {
      taskId: uuidv4(),
      task: data.task.trim(),
      description: data.description,
      projectId: data.projectId,
      workspaceId: data.workspaceId,
      priority: data.priority,
      assignedTo: data.assignedTo,
      createdBy: data.createdBy,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      status: TaskStatus.Todo,
    };

    await this._taskRepo.create(task);
  }

  async getAllTask(
    workspaceId: string,
    projectId: string,
    userId: string
  ): Promise<ITask[]> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const project = await this._projectRepo.findOne({
      projectId,
    });

    if (!project || project.workspaceId !== workspaceId) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_PROJECT_ID,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isManager =
      workspaceMember.role === workspaceRoles.owner ||
      workspaceMember.role === workspaceRoles.projectManager;

    const tasks = isManager
      ? await this._taskRepo.find({ workspaceId, projectId, isDeleted: false })
      : await this._taskRepo.find({
          workspaceId,
          projectId,
          assignedTo: userId,
          isDeleted: false,
        });

    return tasks;
  }

  async removeTask(
    workspaceId: string,
    taskId: string,
    userId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    if (
      workspaceMember.role !== workspaceRoles.owner &&
      workspaceMember.role !== workspaceRoles.projectManager
    ) {
      throw new AppError(ERROR_MESSAGES.ACTION_DENIED, HTTP_STATUS.BAD_REQUEST);
    }

    await this._taskRepo.update({ taskId }, { isDeleted: true });
  }
}
