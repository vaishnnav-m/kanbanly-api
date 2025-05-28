import { Request, Response } from "express";

export interface IOtpController {
  sendOtp(req: Request, res: Response): Promise<void>;
}
