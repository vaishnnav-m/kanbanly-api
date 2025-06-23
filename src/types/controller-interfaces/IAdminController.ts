import { Request, Response } from "express";

export interface IAdminController {
  getAllUsers(req: Request, res: Response): Promise<void>;
}
