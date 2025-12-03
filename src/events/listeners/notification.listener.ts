import { container } from "tsyringe";
import { SocketHandler } from "../../socket/socket.handler";
import { NotificationEvent, notificationEvents } from "../notification.events";
import { NotificationResponseDto } from "../../types/dtos/notification/notification.dto";
import logger from "../../logger/winston.logger";

export function registerNotificationEventListner() {
  const socketHandler = container.resolve(SocketHandler);

  notificationEvents.on(
    NotificationEvent.Notification,
    (notification: NotificationResponseDto) => {
      socketHandler.emitToRoom(
        notification.userId,
        "notification",
        notification
      );
      logger.info(
        `[Event Listener] A notification is sent to ${notification.userId}`
      );
    }
  );
}
