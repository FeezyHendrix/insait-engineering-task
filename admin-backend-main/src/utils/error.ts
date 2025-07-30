export class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class OperationalError extends Error {
  statusCode: number;
  constructor(message: string, public originalError: Error) {
    super(message);
    this.statusCode = 500;
    this.originalError = originalError;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
