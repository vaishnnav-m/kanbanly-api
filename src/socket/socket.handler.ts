import { Server, Socket } from "socket.io";
import logger from "../logger/winston.logger";
import { inject, injectable } from "tsyringe";
import { IMessageService } from "../types/service-interface/IMessageService";
import { IProjectService } from "../types/service-interface/IProjectService";

@injectable()
export class SocketHandler {
  private _io!: Server;
  constructor(
    @inject("IMessageService") private _messageService: IMessageService,
    @inject("IProjectService") private _projectService: IProjectService
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
    const userId = socket.data.userId;
    // join rooms
    socket.on(
      "joinRooms",
      async (payload: { workSpaceId: string; chatId: string }) => {
        const { workSpaceId, chatId } = payload;
        // join workspce rooms
        if (workSpaceId) {
          socket.join(userId);
          const projects = await this._projectService.getAllProjects(
            workSpaceId,
            userId
          );
          if (projects?.length) {
            projects.forEach((project) =>
              socket.join(`project_${project.projectId}`)
            );
            logger.info(`User ${userId} joined ${projects.length} projects`);
          }
        }
        // join chat room
        socket.join(`chat_${chatId}`);
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

        socket
          .to(`chat_${chatId}`)
          .emit("messageReceived", { chatId, senderId: userId, text });
      }
    );
  }
}
