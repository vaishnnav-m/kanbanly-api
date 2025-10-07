import { IEpic } from "../../entities/IEpic";

export type EpicCreationDto = Omit<
  IEpic,
  "epicId" | "createdAt" | "updatedAt" | "normalized"
>;
export type EpicResponseDto = Omit<IEpic, "normalized"> & {
  percentageDone: number;
};

export interface EpicUpdationDto {
  epicId: string;
  workspaceId: string;
  title?: string;
  description?: string;
  color?: string;
}
