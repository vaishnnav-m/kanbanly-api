import { inject, injectable } from "tsyringe";
import { IDashboardService } from "../types/service-interface/IDashboardService";
import {
  DashboardResponseDto,
  ITaskAnalyticsResponse,
  ITeamPerformanceResponse,
  ITopPerformer,
  ITrendItem,
  IWorkloadItem,
  IWorkspaceSummaryResponse,
} from "../types/dtos/dashboard/dashboard.dto";
import { IWorkItemRepository } from "../types/repository-interfaces/IWorkItemRepository";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { IActivityRepository } from "../types/repository-interfaces/IActivityRepository";
import { IProject } from "../types/entities/IProject";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { IWorkItem } from "../types/entities/IWorkItem";
import { TaskStatus } from "../types/dtos/task/task.dto";
import { workspaceRoles } from "../types/dtos/workspaces/workspace-member.dto";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject("IWorkItemRepository") private taskRepo: IWorkItemRepository,
    @inject("IProjectRepository") private projectRepo: IProjectRepository,
    @inject("IWorkspaceMemberRepository")
    private memberRepo: IWorkspaceMemberRepository,
    @inject("IActivityRepository") private activityRepo: IActivityRepository
  ) {}

  async getDashboardData(
    workspaceId: string,
    userId: string
  ): Promise<DashboardResponseDto> {
    const member = this.memberRepo.findOne({ workspaceId, userId });
    if (!member) {
      throw new AppError(ERROR_MESSAGES.NOT_MEMBER, HTTP_STATUS.BAD_REQUEST);
    }

    const [tasks, projects, members, activities] = await Promise.all([
      this.taskRepo.find({ workspaceId }),
      this.projectRepo.find({ workspaceId }),
      this.memberRepo.find({ workspaceId }),
      this.activityRepo.countToday(workspaceId),
    ]);

    return {
      workspaceSummary: await this.buildWorkspaceSummary(
        workspaceId,
        projects,
        members,
        tasks,
        activities
      ),
      taskAnalytics: this.buildTaskAnalytics(tasks),
      teamPerformance: this.buildTeamPerformance(tasks, members),
    };
  }

  private async buildWorkspaceSummary(
    workspaceId: string,
    projects: IProject[],
    members: IWorkspaceMember[],
    tasks: IWorkItem[],
    activities: number
  ): Promise<IWorkspaceSummaryResponse> {
    const [projectsThisMonth, membersThisWeek, lastActivity] =
      await Promise.all([
        this.projectRepo.countCreatedThisMonth(workspaceId),
        this.memberRepo.countJoinedThisWeek(workspaceId),
        this.activityRepo.find(
          { workspaceId },
          { sort: { createdAt: -1 }, limit: 1 }
        ),
      ]);

    const completedTasks = tasks.filter(
      (t) => t.status === TaskStatus.Completed
    ).length;
    const completionRate =
      tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

    return {
      totalProjects: projects.length,
      projectsThisMonth,

      activeMembers: members.length,
      membersThisWeek,

      ongoingTasks: tasks.filter((t) => t.status !== TaskStatus.Completed)
        .length,
      completionRate,

      recentActivities: activities,
      lastActivity: lastActivity[0]?.createdAt || new Date(),
    };
  }

  private buildTaskAnalytics(tasks: IWorkItem[]): ITaskAnalyticsResponse {
    const todo = tasks.filter((t) => t.status === "todo").length;
    const completed = tasks.filter(
      (t) => t.status === TaskStatus.Completed
    ).length;
    const inProgress = tasks.filter(
      (t) => t.status === TaskStatus.InProgress
    ).length;
    // const overdue = tasks.filter(
    //   (t) =>
    //     t.dueDate && t.dueDate < new Date() && t.status !== TaskStatus.Completed
    // ).length;

    const statusDist = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const completionData = [
      { name: "Todo", value: todo, color: "blue" },
      { name: "In Progress", value: inProgress, color: "orange" },
      { name: "Completed", value: completed, color: "green" },
    ];

    const progressData = Object.keys(statusDist).map((key) => ({
      status: key,
      count: statusDist[key],
    }));

    const monthlyCreated: Record<string, number> = {};
    const monthlyCompleted: Record<string, number> = {};

    tasks.forEach((t) => {
      const createdMonth = t.createdAt.toLocaleString("default", {
        month: "short",
      });
      monthlyCreated[createdMonth] = (monthlyCreated[createdMonth] || 0) + 1;

      if (t.status === TaskStatus.Completed) {
        const completedMonth = t.updatedAt.toLocaleString("default", {
          month: "short",
        });
        monthlyCompleted[completedMonth] =
          (monthlyCompleted[completedMonth] || 0) + 1;
      }
    });

    const monthList = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const trendData: ITrendItem[] = monthList.map((m) => ({
      month: m,
      created: monthlyCreated[m] ?? 0,
      completed: monthlyCompleted[m] ?? 0,
    }));

    return {
      completionData,
      progressData,
      trendData,
    };
  }

  private buildTeamPerformance(
    tasks: IWorkItem[],
    members: IWorkspaceMember[]
  ): ITeamPerformanceResponse {
    const completedCount: Record<string, number> = {};

    tasks.forEach((t) => {
      if (t.status !== TaskStatus.Completed || !t.assignedTo) return;

      const userId =
        typeof t.assignedTo === "string" ? t.assignedTo : t.assignedTo.userId;

      completedCount[userId] = (completedCount[userId] || 0) + 1;
    });

    const performers: ITopPerformer[] = members.map((member) => {
      const name = member.name;
      const taskCompleted = completedCount[member.userId] || 0;

      const avatar = member.profile;

      const assignedTasks = tasks.filter(
        (t) =>
          t.assignedTo &&
          (typeof t.assignedTo === "string"
            ? t.assignedTo === member.userId
            : t.assignedTo.userId === member.userId)
      ).length;

      const progress =
        assignedTasks === 0
          ? 0
          : Math.round((taskCompleted / assignedTasks) * 100);

      return {
        name,
        role: member.role,
        taskCompleted,
        avatar,
        progress,
      };
    });

    const topPerformers = performers
      .sort((a, b) => b.taskCompleted - a.taskCompleted)
      .slice(0, 5);

    // WORKLOAD BY ROLE (Owner, PM, Member)
    const workload: Record<string, number> = {
      owner: 0,
      projectManager: 0,
      member: 0,
    };

    tasks.forEach((t) => {
      if (!t.assignedTo) return;

      const assignedMember = members.find((m) => m.userId === t.assignedTo);

      if (assignedMember) {
        workload[assignedMember.role] += 1;
      }
    });

    const totalWorkload =
      Object.values(workload).reduce((a, b) => a + b, 0) || 1;

    const workloadData: IWorkloadItem[] = [
      {
        role: workspaceRoles.owner,
        workload: Math.round((workload.owner / totalWorkload) * 100),
      },
      {
        role: workspaceRoles.projectManager,
        workload: Math.round((workload.projectManager / totalWorkload) * 100),
      },
      {
        role: workspaceRoles.member,
        workload: Math.round((workload.member / totalWorkload) * 100),
      },
    ];

    const totalCompleted = Object.values(completedCount).reduce(
      (a, b) => a + b,
      0
    );
    const productivityScore = Math.round((totalCompleted / tasks.length) * 100);

    return {
      topPerformers,
      workloadData,
      productivityScore,
    };
  }
}
