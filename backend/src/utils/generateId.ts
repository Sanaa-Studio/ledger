import { InvalidIdError } from "../errors/InputError.js";

export const generateId = (maxId: number) => {
  if (typeof maxId !== "number" || maxId < 0 || !Number.isInteger(maxId)) {
    throw new InvalidIdError("ID must be a non-negative integer");
  }

  return maxId + 1;
};
