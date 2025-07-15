import { z } from "zod";
import { workspaceRoles } from "./workspace-member.dto";

export const CreateInvitationSchema = z.object({
  workspaceId: z.string(),
  invitedEmail: z.email(),
  role: z.enum(workspaceRoles),
});

type BaseInvitationDto = z.infer<typeof CreateInvitationSchema>;

export interface CreateInvitationDto {
  workspaceId: string;
  invitedEmail: string;
  role: workspaceRoles;
  invitedBy: string;
}

export type CreateInvitationBodyDto = Omit<
  CreateInvitationDto,
  "invitedBy" | "workspaceId"
>;
