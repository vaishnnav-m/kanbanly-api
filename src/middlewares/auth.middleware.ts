import { NextFunction, Request, Response } from "express";
import "../types/express.d";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { container } from "tsyringe";
import { ITokenService } from "../types/service-interface/ITokenService";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.AUTH_NO_TOKEN_PROVIDED,
    });
  }
  try {
    const tokenService = container.resolve<ITokenService>("TokenService");
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGES.AUTH_INVALID_TOKEN,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.UNEXPECTED_SERVER_ERROR,
    });
  }
};
