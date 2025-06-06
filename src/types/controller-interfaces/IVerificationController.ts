import { Request, Response } from "express";

export interface IVerificationController {
  verifyEmail(req: Request, res: Response): Promise<void>;
  resendEmail(req: Request, res: Response): Promise<void>;
}
