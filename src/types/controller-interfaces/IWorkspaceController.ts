import { Request, Response } from "express";

export interface IWorkspaceController {
  createWorkspace(req: Request, res: Response):Promise<void>;
}
