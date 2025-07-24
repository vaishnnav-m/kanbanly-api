import { Router, RouterOptions } from "express";

export abstract class BaseRoute {
  protected _router: Router;

  constructor(options?: RouterOptions) {
    this._router = Router(options);
  }

  protected abstract initializeRoutes(): void;

  public get router(): Router {
    return this._router;
  }
}
