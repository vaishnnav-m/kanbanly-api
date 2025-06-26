import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../shared/constants/http.status";

export const checkRole =
  (allowedRole: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user?.role || req.user.role !== allowedRole) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: `You need ${allowedRole} access to proceed.`,
      });
      return;
    }
    next();
  };
