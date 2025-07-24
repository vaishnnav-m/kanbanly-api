import { container } from "tsyringe";
import { authEvents } from "../auth.events";
import { IVerificationService } from "../../types/service-interface/IVerificationService";

export function registerUserEventListner() {
  const verificationService = container.resolve<IVerificationService>(
    "IVerificationService"
  );
  authEvents.on(
    "userRegistered",
    async ({ userEmail }: { userEmail: string }) => {
      try {
        await verificationService.sendVerificationEmail(userEmail);
      } catch (error) {
        console.error(
          `[Event Listener] Failed to send verification email for ${userEmail}:`,
          error
        );
      }
    }
  );
}
