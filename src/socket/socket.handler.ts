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

      // joining to the user room
      socket.join(socket.data.userId);
      logger.info(`User joined ${socket.data.userId} room`);

      // registering all the event handlers
      this.registerEventHandlers(socket);

      socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  // function to send the data to a room
  emitToRoom<T>(roomId: string, event: string, payload: T) {
    if (!this._io) return;

    this._io.to(roomId).emit(event, payload);
  }

  // socket event handlers
  private registerEventHandlers(socket: Socket) {
    const userId = socket.data.userId;
    // join rooms
    socket.on("joinChatRoom", async (payload: { chatId: string }) => {
      const { chatId } = payload;

      // join chat room
      socket.join(chatId);
      logger.info(`User ${userId} joined ${chatId} chat`);
    });

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

        socket
          .to(chatId)
          .emit("messageReceived", { chatId, senderId: userId, text });
      }
    );

    // join workspace room
    socket.on("joinWorkspaceRoom", async (payload: { workSpaceId: string }) => {
      const { workSpaceId } = payload;

      socket.join(workSpaceId);
      logger.info(`User ${userId} joined ${workSpaceId} workpsace room`);
    });

    // join project room
    socket.on("joinProjectRoom", async (payload: { projectId: string }) => {
      const { projectId } = payload;

      socket.join(projectId);
      logger.info(`User ${userId} joined ${projectId} project room`);
    });
  }
}
