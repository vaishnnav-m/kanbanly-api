import { IEpic } from "../../entities/IEpic";
import { TaskListingDto, TaskStatus } from "../task/task.dto";

export type EpicCreationDto = Omit<
  IEpic,
  "epicId" | "createdAt" | "updatedAt" | "normalized" | "status"
>;
export type EpicResponseDto = Omit<IEpic, "normalized" | "status"> & {
  percentageDone: number;
};

export interface EpicUpdationDto {
  epicId: string;
  workspaceId: string;
  title?: string;
  description?: string;
  color?: string;
  dueDate?: Date;
}

export interface EpicDetailsDto extends EpicResponseDto {
  status: TaskStatus;
  children?: TaskListingDto[];
}
