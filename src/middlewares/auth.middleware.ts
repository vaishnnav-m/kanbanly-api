import { NextFunction, Request, Response } from "express";
import "../types/express.d";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { container } from "tsyringe";
import { ITokenService } from "../types/service-interface/ITokenService";
import logger from "../logger/winston.logger";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.AUTH_NO_TOKEN_PROVIDED,
    });
    return;
  }

  try {
    const tokenService = container.resolve<ITokenService>("ITokenService");
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.AUTH_INVALID_TOKEN,
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.UNEXPECTED_SERVER_ERROR,
    });
  }
};
