import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { ITaskService } from "../types/service-interface/ITaskService";
import { ITaskRepository } from "../types/repository-interfaces/ITaskRepository";
import {
  CreateTaskDto,
  EditTaskDto,
  TaskDetailsDto,
  TaskStatus,
} from "../types/dtos/task/task.dto";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { ITask } from "../types/entities/ITask";
import { IProjectService } from "../types/service-interface/IProjectService";

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject("ITaskRepository") private _taskRepo: ITaskRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IProjectService") private _projectService: IProjectService
  ) {}

  async createTask(data: CreateTaskDto): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId: data.createdBy,
      workspaceId: data.workspaceId,
      isActive: true,
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
        ERROR_MESSAGES.PROJECT_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (data.assignedTo) {
      const assignee = await this._workspaceMemberRepo.findOne({
        userId: data.assignedTo,
        workspaceId: data.workspaceId,
        isActive: true,
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
      isActive: true,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const project = await this._projectRepo.findOne({
      projectId,
    });

    if (!project || project.workspaceId !== workspaceId) {
      throw new AppError(
        ERROR_MESSAGES.PROJECT_NOT_FOUND,
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

  async getOneTask(
    workspaceId: string,
    projectId: string,
    userId: string,
    taskId: string
  ): Promise<TaskDetailsDto> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
    });

    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const query =
      workspaceMember.role === "member" ? { assignedTo: userId } : {};

    const task = await this._taskRepo.getTasksWithAssigness({
      taskId,
      projectId,
      ...query,
    });

    if (!task) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      taskId: task.taskId,
      task: task.task,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo:
        !task?.assignedTo || Array.isArray(task?.assignedTo)
          ? null
          : {
              name: task.assignedTo.name,
              email: task.assignedTo.email,
            },
      status: task.status,
    };
  }

  async changeTaskStatus(
    taskId: string,
    userId: string,
    newStatus: TaskStatus
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      isActive: true,
    });
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }

    const task = await this._taskRepo.findOne({ taskId, isDeleted: false });
    if (!task) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const isAllowed =
      workspaceMember.role === "member"
        ? task.assignedTo === workspaceMember.userId
        : true;
    if (!isAllowed) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._taskRepo.update({ taskId }, { status: newStatus });
  }

  async editTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    data: EditTaskDto
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
    });
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
    }

    const task = await this._taskRepo.findOne({ taskId });
    if (!task) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const isAllowed = workspaceMember.role !== "member";
    if (!isAllowed) {
      throw new AppError(
        ERROR_MESSAGES.INSUFFICIENT_PERMISSION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let assigneeId: string = "";
    if (data.assignedTo) {
      const assignee = await this._workspaceMemberRepo.findOne({
        email: data.assignedTo,
        isActive: true,
      });
      if (!assignee) {
        throw new AppError(
          ERROR_MESSAGES.MEMBER_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      assigneeId = assignee.userId.toString();
      const projectMembers = await this._projectService.getMembers(
        workspaceId,
        userId,
        projectId
      );

      const isAssigneeInProject = projectMembers.some(
        (member) => member.email === data.assignedTo
      );

      if (!isAssigneeInProject) {
        await this._projectService.addMember(
          workspaceId,
          userId,
          projectId,
          data.assignedTo
        );
      }
    }

    const newTask: Partial<ITask> = {
      ...(data.task && { task: data.task }),
      ...(data.description && { description: data.description }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.assignedTo && assigneeId && { assignedTo: assigneeId }),
    };

    await this._taskRepo.update({ taskId }, newTask);
  }

  async removeTask(
    workspaceId: string,
    taskId: string,
    userId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
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
