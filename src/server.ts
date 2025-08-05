import express, { Application } from "express";
import cors from "cors";
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

export default class Server {
  private _app: Application;
  private _port: number;

  constructor() {
    this._app = express();
    this._port = config.server.PORT;
    this.initialize();
  }

  private initialize() {
    DependencyInjection.registerAll();
    registerUserEventListner();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorMiddlewares();
  }

  private configureMiddlewares(): void {
    this._app.use(cors(corsOptions));
    this._app.use(express.json());
    this._app.use(cookieParser());
  }

  private configureErrorMiddlewares() {
    const errorMiddlewareInstance = container.resolve(ErrorMiddleware);
    this._app.use(
      errorMiddlewareInstance.handleError.bind(errorMiddlewareInstance)
    );
  }

  private configureRoutes(): void {
    this._app.use("/api/v1/auth", container.resolve(AuthRoutes).router);
    this._app.use("/api/v1/admin", container.resolve(AdminRoutes).router);
    this._app.use("/api/v1/user", container.resolve(UserRoutes).router);
    this._app.use(
      "/api/v1/workspace",
      container.resolve(WorkspaceRoutes).router
    );
    this._app.use(
      "/api/v1/invitations",
      container.resolve(InvitationRoutes).router
    );
  }

  public start(): void {
    this._app.listen(this._port, () => {
      console.log(`server started at port ${this._port}`);
    });
  }
}
