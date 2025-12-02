import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { ITaskService } from "../types/service-interface/ITaskService";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import {
  CreateTaskDto,
  EditTaskDto,
  SubTaskListingDto,
  TaskDetailsDto,
  TaskFilters,
  TaskListingDto,
  TaskStatus,
  WorkItemType,
} from "../types/dtos/task/task.dto";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { IWorkItem } from "../types/entities/IWorkItem";
import { IProjectService } from "../types/service-interface/IProjectService";
import logger from "../logger/winston.logger";
import { ISprintService } from "../types/service-interface/ISprintService";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { IActivityService } from "../types/service-interface/IActivityService";
import { CreateActivityDto } from "../types/dtos/activity/activity.dto";
import { ActivityTypeEnum } from "../types/enums/activity-type.enum";

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject("IWorkItemRepository") private _workItemRepo: IWorkItemRepository,
    @inject("IWorkspaceMemberRepository")
    private _workspaceMemberRepo: IWorkspaceMemberRepository,
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("IProjectService") private _projectService: IProjectService,
    @inject("ISprintService") private _sprintService: ISprintService,
    @inject("IActivityService") private _activityService: IActivityService
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

    const newTask: Omit<IWorkItem, "isDeleted" | "createdAt" | "updatedAt"> = {
      taskId: uuidv4(),
      task: data.task.trim(),
      description: data.description,
      projectId: data.projectId,
      workspaceId: data.workspaceId,
      priority: data.priority,
      assignedTo: data.assignedTo,
      createdBy: data.createdBy,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      status: data.status ? data.status : TaskStatus.Todo,
      workItemType: data.workItemType,
      ...(data.epicId && { epicId: data.epicId }),
      ...(data.sprintId && { sprintId: data.sprintId }),
      ...(data.parentId && { parent: data.parentId }),
      ...(data.storyPoint && { storyPoint: data.storyPoint }),
    };

    const task = await this._workItemRepo.create(newTask);

    const activitylogPayload: CreateActivityDto = {
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      taskId: task.taskId,
      entityId: task.taskId,
      entityType: ActivityTypeEnum.Task,
      action: "task_created",
      description: `Task created.`,
      member: task.createdBy as string,
    };

    await this._activityService.createActivity(activitylogPayload);
  }

  async getAllTask(
    workspaceId: string,
    projectId: string,
    userId: string,
    filters: TaskFilters
  ): Promise<TaskListingDto[]> {
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

    const tasks = await this._workItemRepo.getTasksWithAssigness({
      workspaceId,
      projectId,
      workItemType: { $ne: WorkItemType.Subtask },
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.assignedTo && { status: filters.assignedTo }),
      isDeleted: false,
    });

    const mappedTasks = tasks.map((task) => {
      const assignedTo = task.assignedTo as IWorkspaceMember;
      const createdBy = task.createdBy as IWorkspaceMember;

      return {
        taskId: task.taskId,
        task: task.task,
        dueDate: task.dueDate,
        priority: task.priority,
        assignedTo: assignedTo
          ? {
              name: assignedTo.name,
              email: assignedTo.email,
              profile: assignedTo.profile,
            }
          : null,
        status: task.status,
        workItemType: task.workItemType,
        epic: task.epic,
        sprintId: task.sprintId,
        createdBy: {
          name: createdBy.name,
          email: createdBy.email,
          profile: createdBy.profile,
        },
      };
    });

    return mappedTasks;
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

    const taskData = await this._workItemRepo.getTasksWithAssigness({
      workspaceId,
      taskId,
      projectId,
      ...query,
    });
    const task = taskData[0];

    if (!task) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const assignedTo = task.assignedTo as IWorkspaceMember;
    const createdBy = task.createdBy as IWorkspaceMember;

    let parent: {
      name: string;
      parentId: string;
      type: WorkItemType;
      color?: string;
    } | null = null;

    if (task.parent && typeof task.parent === "object") {
      parent = {
        parentId: task.parent.taskId,
        name: task.parent.task,
        type: task.parent.workItemType,
      };
    }
    if (task.epic) {
      parent = {
        name: task.epic.title,
        parentId: task.epic.epicId,
        type: WorkItemType.Epic,
        color: task.epic.color,
      };
    }

    return {
      taskId: task.taskId,
      task: task.task,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo: assignedTo
        ? {
            name: assignedTo.name,
            email: assignedTo.email,
            profile: assignedTo.profile,
          }
        : null,
      ...(parent && {
        parent,
      }),
      status: task.status,
      createdBy: {
        name: createdBy.name,
        email: createdBy.email,
        profile: createdBy.profile,
      },
      storyPoint: task.storyPoint,
      workItemType: task.workItemType,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async getAllSubTasks(
    workspaceId: string,
    projectId: string,
    userId: string,
    taskId: string
  ): Promise<SubTaskListingDto[]> {
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

    const tasks = await this._workItemRepo.getTasksWithAssigness({
      workspaceId,
      projectId,
      parent: taskId,
      workItemType: WorkItemType.Subtask,
    });

    const mappedTasks = tasks.map((task) => {
      const createdBy = task.createdBy as IWorkspaceMember;

      return {
        taskId: task.taskId,
        task: task.task,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        createdBy: {
          name: createdBy.name,
          email: createdBy.email,
        },
      };
    });

    return mappedTasks;
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

    const task = await this._workItemRepo.findOne({ taskId, isDeleted: false });
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

    await this._workItemRepo.update({ taskId }, { status: newStatus });

    const activitylogPayload: CreateActivityDto = {
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      taskId: task.taskId,
      entityId: task.taskId,
      entityType: ActivityTypeEnum.Task,
      action: "status_changed",
      description: `Task status changed from ${task.status} to ${newStatus}`,
      member: task.createdBy as string,
      oldValue: { status: task.status },
      newValue: { status: newStatus },
    };

    await this._activityService.createActivity(activitylogPayload);
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

    const task = await this._workItemRepo.findOne({ taskId });
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

    const newTask: Partial<IWorkItem> = {
      ...(data.task && { task: data.task }),
      ...(data.description && { description: data.description }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.assignedTo && assigneeId && { assignedTo: assigneeId }),
      ...(data.storyPoint && { storyPoint: data.storyPoint }),
    };

    if (!Object.keys(newTask).length) {
      return;
    }

    await this._workItemRepo.update({ taskId }, newTask);

    const changedFields: Partial<Record<keyof IWorkItem, boolean>> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldValues: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newValues: Record<string, any> = {};

    for (const key in newTask) {
      const objkey = key as keyof IWorkItem;
      if (task[objkey] !== newTask[objkey]) {
        changedFields[objkey] = true;
        oldValues[objkey] = task[objkey];
        newValues[objkey] = newTask[objkey];
      }
    }

    if (Object.keys(changedFields).length) {
      const description = `Updated ${Object.keys(changedFields).join(", ")}`;

      const activitylogPayload: CreateActivityDto = {
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        taskId: task.taskId,
        entityId: task.taskId,
        entityType: ActivityTypeEnum.Task,
        action: "task_updated",
        description,
        member: task.createdBy as string,
        oldValue: oldValues,
        newValue: newValues,
      };

      await this._activityService.createActivity(activitylogPayload);
    }
  }

  async attachParentItem(
    parentType: WorkItemType,
    parentId: string,
    taskId: string,
    userId: string,
    workspaceId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
    });
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const task = await this._workItemRepo.findOne({ taskId });
    if (!task) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    switch (parentType) {
      case "epic":
        await this._workItemRepo.update({ taskId }, { epicId: parentId });
        break;
      case "story":
        await this._workItemRepo.update({ taskId }, { epicId: parentId });
        break;
      default:
        logger.error("An unhandled parent type in parent attach method :", {
          type: parentType,
        });
    }
  }

  async attachSprint(
    userId: string,
    taskId: string,
    sprintId: string,
    workspaceId: string,
    projectId: string
  ): Promise<void> {
    const workspaceMember = await this._workspaceMemberRepo.findOne({
      userId,
      workspaceId,
      isActive: true,
    });
    if (!workspaceMember) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const task = await this._workItemRepo.findOne({ taskId });
    if (!task) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!sprintId) {
      await this._workItemRepo.update({ taskId }, { sprintId: "" });
      return;
    }

    if (task.sprintId) {
      throw new AppError(
        ERROR_MESSAGES.SPRINT_EXISTS_TASK,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const sprint = await this._sprintService.getOneSprint(
      userId,
      sprintId,
      workspaceId,
      projectId
    );

    if (!sprint) {
      throw new AppError(
        ERROR_MESSAGES.SPRINT_NOT_EXISTS,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._workItemRepo.update({ taskId }, { sprintId });
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

    await this._workItemRepo.update({ taskId }, { isDeleted: true });
  }
}
