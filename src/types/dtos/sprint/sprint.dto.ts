export enum SprintStatus {
  Future = "future",
  Active = "active",
  Completed = "completed",
}

export interface CreateSprintDto {
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
}

export interface SprintResponseDto {
  sprintId: string;
  name: string;
  startDate: Date;
  endDate: Date;
}
