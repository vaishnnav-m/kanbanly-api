import { Server, Socket } from "socket.io";
import logger from "../logger/winston.logger";
import { inject, injectable } from "tsyringe";
import { IMessageService } from "../types/service-interface/IMessageService";

@injectable()
export class SocketHandler {
  private _io!: Server;
  constructor(
    @inject("IMessageService") private _messageService: IMessageService
  ) {}

  initialize(io: Server) {
    this._io = io;

    this._io.on("connection", (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      this.registerEventHandlers(socket);

      socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  private registerEventHandlers(socket: Socket) {
    socket.on(
      "joinRooms",
      (payload: { userId: string; projectIds: string[] }) => {
        const { userId, projectIds } = payload;

        socket.join(userId);
        projectIds.forEach((pid) => socket.join(`project_${pid}`));
        logger.info(`User ${userId} joined ${projectIds}`);
      }
    );
  }
}
