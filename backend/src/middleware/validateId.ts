import type { Request, Response, NextFunction } from "express";

import { InvalidIdError } from "../errors/AppError.js";

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction,
  value: string,
) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new InvalidIdError("ID must be a positive integer");
  }

  next();
};
