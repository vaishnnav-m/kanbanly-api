import http from "http";
import cors from "cors";
import * as cookie from "cookie";
import express, { Application } from "express";
import morgan from "morgan";
import { container } from "tsyringe";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Server as SocketServer } from "socket.io";
import { config } from "./config";
import { AuthRoutes } from "./routes/auth/auth.routes";
import { DependencyInjection } from "./di";
import { corsOptions } from "./middlewares/cors.middleware";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { AdminRoutes } from "./routes/admin/admin.routes";
import { WorkspaceRoutes } from "./routes/workspaces/workspace.routes";
import { InvitationRoutes } from "./routes/invitations/invitation.routes";
import { UserRoutes } from "./routes/user/user.routes";
import { PlanRoutes } from "./routes/plan/plan.routes";
import { SubscriptionRoutes } from "./routes/subscription/subscription.routes";
import { WebhookRoutes } from "./routes/webhook/webhook.routes";
import logger from "./logger/winston.logger";
import { CloudinaryRoutes } from "./routes/cloudinary/cloudinary.routes";
import { SocketHandler } from "./socket/socket.handler";
import { ITokenService } from "./types/service-interface/ITokenService";
import { registerEvents } from "./events";
import { AiRoutes } from "./routes/ai/ai.routes";

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
        credentials: true,
      },
    });
  }

  private initialize() {
    DependencyInjection.registerAll();
    registerEvents();
    this.configureWebhooks();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorMiddlewares();
  }

  // Middlewares
  private configureMiddlewares(): void {
    this._app.use(cors(corsOptions));
    this._app.use(express.json());
    this._app.use(cookieParser());
    this._app.use(helmet());
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
    this._app.use("/api/v1/ai", container.resolve(AiRoutes).router);
  }

  // Socket.io setup
  private configureSocket(): void {
    const tokenService = container.resolve<ITokenService>("ITokenService");
    this._io.use(async (socket, next) => {
      try {
        const cookieString = socket.request.headers.cookie;
        if (!cookieString) {
          return next(new Error("Cookies missing"));
        }

        const parsedCookie = cookie.parse(cookieString);
        const token = parsedCookie.accessToken;

        if (!token) {
          return next(new Error("Token is missing"));
        }

        const paylod = tokenService.verifyAccessToken(token);
        socket.data.userId = paylod?.userid;

        next();
      } catch (error) {
        console.log(error);
      }
    });
    const socketHandler = container.resolve(SocketHandler);
    socketHandler.initialize(this._io);
  }

  // Start server
  public start(): void {
    this.initialize();
    this._httpServer.listen(this._port, () => {
      logger.info(`server started at port ${this._port}`);
    });
    this.configureSocket();
  }
}
