import { Router } from "express";

export abstract class BaseRoute{
  protected _router: Router;

  constructor() {
    this._router = Router();
  }

  protected abstract initializeRoutes(): void;

  public get router(): Router {
    return this._router;
  }
}
