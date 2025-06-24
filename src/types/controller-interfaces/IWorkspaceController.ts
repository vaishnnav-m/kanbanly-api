import { Request, Response } from "express";

export interface IWorkspaceController {
  createWorkspace(req: Request, res: Response): Promise<void>;
  getAllWorkspaces(req: Request, res: Response): Promise<void>;
  addUserWorkspace(req: Request, res: Response): Promise<void>;
}
