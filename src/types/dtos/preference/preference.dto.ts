import { IPreference } from "../../entities/IPreference";

export type PreferenceResponseDto = Omit<
  IPreference,
  "createdAt" | "updatedAt"
>;

export type UpdatePreferenceDto = Partial<
  Pick<IPreference, "taskAssigned" | "mention" | "dueDateReminder">
> & { userId: string };
