import { workspaceRoles } from "../workspaces/workspace-member.dto";

export interface ICompletionSlice {
  name: string;
  value: number;
  color: string;
}

export interface IProgressItem {
  status: string;
  count: number;
}

export interface ITrendItem {
  month: string;
  created: number;
  completed: number;
}

export interface ITopPerformer {
  name: string;
  role: string;
  taskCompleted: number;
  avatar?: string;
  progress: number;
}

export interface IWorkloadItem {
  role: workspaceRoles;
  workload: number;
}

export interface ITaskAnalyticsResponse {
  completionData: ICompletionSlice[];
  progressData: IProgressItem[];
  trendData: ITrendItem[];
}

export interface ITeamPerformanceResponse {
  topPerformers: ITopPerformer[];
  workloadData: IWorkloadItem[];
  productivityScore: number;
}

export interface IWorkspaceSummaryResponse {
  totalProjects: number;
  projectsThisMonth: number;
  activeMembers: number;
  membersThisWeek: number;
  ongoingTasks: number;
  completionRate: number;
  recentActivities: number;
  lastActivity: Date;
}

export interface DashboardResponseDto {
  workspaceSummary: IWorkspaceSummaryResponse;
  taskAnalytics: ITaskAnalyticsResponse;
  teamPerformance: ITeamPerformanceResponse;
}
