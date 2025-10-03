import { IEpic } from "../../entities/IEpic";

export type EpicCreationDto = Omit<
  IEpic,
  "epicId" | "createdAt" | "updatedAt" | "normalized"
>;
export type EpicResponseDto = Omit<IEpic, "normalized">;
