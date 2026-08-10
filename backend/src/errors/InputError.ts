export class InputError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export class InvalidIdError extends InputError {
  constructor(message: string) {
    super(message, "INVALID_ID");
  }
}
