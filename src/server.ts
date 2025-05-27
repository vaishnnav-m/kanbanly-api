import express, { Application } from "express";
import { config } from "./config";
import { AuthRoutes } from "./routes/auth/auth.routes";
import { container } from "tsyringe";
import { DependencyInjection } from "./di";

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
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this._app.use(express.json());
  }

  private configureRoutes(): void {
    this._app.use("/api/v1/auth", container.resolve(AuthRoutes).router);
  }

  public start(): void {
    this._app.listen(this._port, () => {
      console.log(`server started at port ${this._port}`);
    });
  }
}
