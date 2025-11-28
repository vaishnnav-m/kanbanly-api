import { Server, Socket } from "socket.io";
import { inject, singleton } from "tsyringe";
import logger from "../logger/winston.logger";
import { IMessageService } from "../types/service-interface/IMessageService";

@singleton()
export class SocketHandler {
  private _io!: Server;
  constructor(
    @inject("IMessageService") private _messageService: IMessageService
  ) {}

  initialize(io: Server) {
    this._io = io;

    this._io.on("connection", (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.join(socket.data.userId);

      logger.info(`User joined ${socket.data.userId} room`);

      this.registerEventHandlers(socket);

      socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  emitToUser<T>(userId: string, event: string, payload: T) {
    if (!this._io) return;

    this._io.to(userId).emit(event, payload);
  }

  private registerEventHandlers(socket: Socket) {
    const userId = socket.data.userId;
    // join rooms
    socket.on(
      "joinRooms",
      async (payload: { workSpaceId: string; chatId: string }) => {
        const { chatId } = payload;

        // join chat room
        socket.join(chatId);
        logger.info(`User ${userId} joined ${chatId} chat`);
      }
    );

    // sendMessage
    socket.on(
      "sendMessage",
      async (payload: { chatId: string; text: string }) => {
        const { chatId, text } = payload;

        await this._messageService.createMessage({
          chatId,
          senderId: userId,
          text,
        });

        console.log(`${text} message sending...`);
        socket
          .to(chatId)
          .emit("messageReceived", { chatId, senderId: userId, text });
      }
    );
  }
}
