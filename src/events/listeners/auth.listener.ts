import { container } from "tsyringe";
import { AuthEvent, authEvents } from "../auth.events";
import { IVerificationService } from "../../types/service-interface/IVerificationService";
import { ISubscriptionService } from "../../types/service-interface/ISubscriptionService";
import logger from "../../logger/winston.logger";

export function registerUserEventListner() {
  const verificationService = container.resolve<IVerificationService>(
    "IVerificationService"
  );
  const subscriptionService = container.resolve<ISubscriptionService>(
    "ISubscriptionService"
  );

  authEvents.on(
    AuthEvent.UserRegistered,
    async ({ userEmail }: { userEmail: string }) => {
      try {
        await verificationService.sendVerificationEmail(userEmail);
        logger.info(
          `[Event Listener] An verification email is sent to ${userEmail} `
        );
      } catch (error) {
        logger.error(
          `[Event Listener] Failed to send verification email for ${userEmail}:`,
          error
        );
      }
    }
  );

  authEvents.on(
    AuthEvent.EmailVerified,
    async ({ userId }: { userId: string }) => {
      try {
        await subscriptionService.createFreeSubscription(userId);
      } catch (error) {
        logger.error(
          `[Event Listener] Failed to create subscription for ${userId}:`,
          error
        );
      }
    }
  );
}
