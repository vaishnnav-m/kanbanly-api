import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import { AuthRoutes } from "./routes/auth/auth.routes";
import { container } from "tsyringe";
import { DependencyInjection } from "./di";
import { corsOptions } from "./middlewares/cors.middleware";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { AdminRoutes } from "./routes/admin/admin.routes";
import { WorkspaceRoutes } from "./routes/workspaces/workspace.routes";
import { InvitationRoutes } from "./routes/invitations/invitation.routes";
import { registerUserEventListner } from "./events/listeners/auth.listener";
import { UserRoutes } from "./routes/user/user.routes";
import { PlanRoutes } from "./routes/plan/plan.routes";
import { SubscriptionRoutes } from "./routes/subscription/subscription.routes";
import { WebhookRoutes } from "./routes/webhook/webhook.routes";
import logger from "./logger/winston.logger";
import { CloudinaryRoutes } from "./routes/cloudinary/cloudinary.routes";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { SocketHandler } from "./socket/socket.handler";

export default class Server {
  private _app: Application;
  private _port: number;
  private _httpServer: http.Server;
  private _io: SocketServer;

  constructor() {
    this._app = express();
    this._httpServer = http.createServer(this._app);
    this._port = config.server.PORT;
    this._io = new SocketServer(this._httpServer, {
      cors: {
        origin: [config.cors.ALLOWED_ORIGIN],
      },
    });
    this.initialize();
  }

  private initialize() {
    DependencyInjection.registerAll();
    registerUserEventListner();
    this.configureWebhooks();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorMiddlewares();
    this.configureSocket();
  }

  // Middlewares
  private configureMiddlewares(): void {
    this._app.use(cors(corsOptions));
    this._app.use(express.json());
    this._app.use(cookieParser());
    this._app.use(morgan("dev"));
  }

  // Error middlewares
  private configureErrorMiddlewares() {
    const errorMiddlewareInstance = container.resolve(ErrorMiddleware);
    this._app.use(
      errorMiddlewareInstance.handleError.bind(errorMiddlewareInstance)
    );
  }

  // Webhooks
  private configureWebhooks() {
    this._app.use("/api/v1/webhooks", container.resolve(WebhookRoutes).router);
  }

  // Routes
  private configureRoutes(): void {
    this._app.use("/api/v1/auth", container.resolve(AuthRoutes).router);
    this._app.use("/api/v1/admin", container.resolve(AdminRoutes).router);
    this._app.use("/api/v1/user", container.resolve(UserRoutes).router);
    this._app.use(
      "/api/v1/cloudinary",
      container.resolve(CloudinaryRoutes).router
    );
    this._app.use(
      "/api/v1/workspace",
      container.resolve(WorkspaceRoutes).router
    );
    this._app.use(
      "/api/v1/invitations",
      container.resolve(InvitationRoutes).router
    );
    this._app.use("/api/v1/plans", container.resolve(PlanRoutes).router);
    this._app.use(
      "/api/v1/subscriptions",
      container.resolve(SubscriptionRoutes).router
    );
  }

  // Socket.io setup
  private configureSocket(): void {
    const socketHandler = container.resolve(SocketHandler);
    socketHandler.initialize(this._io);
  }

  // Start server
  public start(): void {
    this._httpServer.listen(this._port, () => {
      logger.info(`server started at port ${this._port}`);
    });
  }
}
