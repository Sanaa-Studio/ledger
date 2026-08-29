import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined && {
          details: err.details,
        }),
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  });
};
