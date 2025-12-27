import { container } from "tsyringe";
import { AppEvent, appEvents } from "../app.events";
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

  appEvents.on(
    AppEvent.UserRegistered,
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

  appEvents.on(
    AppEvent.EmailVerified,
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
