import { Request, Response } from "express";

export interface IAuthController {
  registerUser(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  googleAuthCallback(req: Request, res: Response): Promise<void>;
  refreshAccessToken(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  adminLogin(req: Request, res: Response): Promise<void>;
}
