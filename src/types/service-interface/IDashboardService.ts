import { DashboardResponseDto } from "../dtos/dashboard/dashboard.dto";

export interface IDashboardService {
  getDashboardData(
    workspaceId: string,
    userId: string
  ): Promise<DashboardResponseDto>;
}
