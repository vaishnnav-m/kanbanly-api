import { z } from "zod";
import { workspaceRoles } from "./workspace-member.dto";

export const CreateInvitationSchema = z.object({
  workspaceId: z.string(),
  invitedEmail: z.email(),
  role: z.enum(workspaceRoles),
  invitedUserId: z.string(),
});

type BaseInvitationDto = z.infer<typeof CreateInvitationSchema>;

export type CreateInvitationDto = BaseInvitationDto & { invitedBy: string };
