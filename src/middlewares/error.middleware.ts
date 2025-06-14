import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import AppError from "../shared/utils/AppError";

@injectable()
export class ErrorMiddleware {
  public handleError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES.UNEXPECTED_SERVER_ERROR;

    if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
    } else {
      statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      message = err.message || ERROR_MESSAGES.UNEXPECTED_SERVER_ERROR;
    }
    console.error(`[${statusCode}] ${message}`);
    console.error(err);
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
