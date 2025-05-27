import { Request, Response } from "express";

export interface IUserController {
  registerUser(req: Request, res: Response): Promise<void>;
}
